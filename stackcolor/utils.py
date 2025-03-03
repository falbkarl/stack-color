import numpy as np
from scipy.interpolate import CubicSpline
from scipy.integrate import quad


# defines allowed materials
MATERIALS = ('air', 'graphite', 'hbn', 'sio2', 'si', 'wse2')


def interp_N(material):
    '''
    creates a function for a given refractive index of a material by interpolating data
    '''
    global MATERIALS
    if material not in MATERIALS:
        raise ValueError(f'{material} not in allowed materials: {MATERIALS}')

    # for air we just use this function
    if material == 'air':
        return lambda l : 1 + 0.05792105/(238.0185 - l**-2) + 0.00167917/(57.362-l**-2)

    data_path = f'./stackcolor/refr_data/{material}.csv'
    data = np.loadtxt(data_path, delimiter=',', dtype=float, skiprows=1)
    ls = data[:, 0]*1e-6
    ns = data[:, 1]
    ks = data[:, 2]

    ## data must include 380-780nm or cublic spline will spew crazy values
    n_spl = CubicSpline(ls, ns)
    k_spl = CubicSpline(ls, ks)
    
    return lambda l: n_spl(l) - 1j*k_spl(l)


# define our wavelength dependent indices of refraction
refr_dict = dict()
for mat in MATERIALS:
    refr_dict[mat] = interp_N(mat)
lattice_c_dict = {'graphite':0.335e-9, 'hbn':0.333e-9, 'wse2':0.6491e-9}


# black body spectrum
def incandescent(l, T):
    '''spectral radiance of a blackbody at T [K] and lambda [1/m]'''
    h = 6.62607015e-34
    mu0 = 4*np.pi*1e-7
    e0 = 8.8541878128e-12
    c = 1/np.sqrt(mu0*e0)
    k = 1.380649e-23
    return 2 * h * c**2 / (np.exp(h*c/k/T/l)-1) / l**5 

# https://en.wikipedia.org/wiki/CIE_1931_color_space
# approximating XYZ functions with some piecewise gauss functions
def pw_gauss(x, u, t1, t2):
    '''
    gaussian with spread t1 to left of u and t2 to right of u
    '''
    return np.where(x < u, np.exp(-t1**2 * (x-u)**2 / 2), np.exp(-t2**2 * (x-u)**2 / 2))

def x_bar(lam):
    '''
    CIE 1931 x-bar function
    '''
    l = lam*1e9
    tot = 1.056*pw_gauss(l, 599.8, 0.0264, 0.0323)
    tot += 0.362*pw_gauss(l, 442.0, 0.0624, 0.0374)
    tot -= 0.065*pw_gauss(l, 501.1, 0.0490, 0.0382)
    return tot

def y_bar(lam):
    '''
    CIE 1931 y-bar function - luminance
    '''
    l = lam*1e9
    tot = 0.821*pw_gauss(l, 568.8, 0.0213, 0.0247)
    tot += 0.286*pw_gauss(l, 530.9, 0.0613, 0.0322)
    return tot

def z_bar(lam):
    '''
    CIE 1931 z-bar function
    '''
    l = lam*1e9
    tot = 1.217*pw_gauss(l, 437.0, 0.0845, 0.0278)
    tot += 0.681*pw_gauss(l, 459.0, 0.0385, 0.0725)
    return tot

def interp_camera_sensitivities(channel):
    '''
    use motic s6 camera sensor sensitivity curves instead of CIE model
    '''
    data_path = f'./stackcolor/motic_data/{channel}.csv'
    data = np.loadtxt(data_path, delimiter=',', dtype=float, skiprows=1)
    ls = data[:,0]*1e-9
    sens = data[:,1]
    return lambda l: CubicSpline(ls, sens)(l)

r_s6 = interp_camera_sensitivities('R')
g_s6 = interp_camera_sensitivities('G')
b_s6 = interp_camera_sensitivities('B')

def human_lin_rgb(refl_func, color_temp):
    '''
    calculates linear (pre-gamma-function) and uncapped (not limited to [0, 1]) RGB values using CIE 1931 (human perceptual model)
    '''
    l_lo = 380e-9
    l_hi = 780e-9

    # https://en.wikipedia.org/wiki/CIE_1931_color_space
    
    n_int = lambda l: incandescent(l, color_temp)*y_bar(l)
    x_int = lambda l: refl_func(l)*incandescent(l, color_temp)*x_bar(l)
    y_int = lambda l: refl_func(l)*incandescent(l, color_temp)*y_bar(l)
    z_int = lambda l: refl_func(l)*incandescent(l, color_temp)*z_bar(l)
    
    N = quad(n_int, l_lo, l_hi, full_output=1)[0]
    X = quad(x_int, l_lo, l_hi, full_output=1)[0] / N
    Y = quad(y_int, l_lo, l_hi, full_output=1)[0] / N
    Z = quad(z_int, l_lo, l_hi, full_output=1)[0] / N

    # https://www.image-engineering.de/library/technotes/958-how-to-convert-between-srgb-and-ciexyz

    conv = np.array([[3.2404542, -1.5371385, -0.4985314], [-0.9692660, 1.8760108, 0.0415560], [0.0556434, -0.2040259, 1.0572252]])
    lin_rgb = np.matmul(conv, np.array([X, Y, Z]))
    return lin_rgb

def motics6_lin_rgb(refl_func, color_temp):
    '''
    calculates linear (pre-gamma-function) and uncapped (not limited to [0, 1]) RGB values using moticam s6 camera sensor (model)
    '''
    l_lo = 400e-9
    l_hi = 700e-9

    fudge_factor = 1/2
    n_int = lambda l: incandescent(l, color_temp)*fudge_factor ## TBD
    r_int = lambda l: refl_func(l)*incandescent(l, color_temp)*r_s6(l)
    g_int = lambda l: refl_func(l)*incandescent(l, color_temp)*g_s6(l)
    b_int = lambda l: refl_func(l)*incandescent(l, color_temp)*b_s6(l)
    
    N = quad(n_int, l_lo, l_hi, full_output=1)[0]
    r = quad(r_int, l_lo, l_hi, full_output=1)[0] / N
    g = quad(g_int, l_lo, l_hi, full_output=1)[0] / N
    b = quad(b_int, l_lo, l_hi, full_output=1)[0] / N

    return np.array([r, g, b])

def gamma(x):
    '''
    linear RGB -> sRGB
    '''
    return np.where(x <= 0.0031308, x*12.92, 1.055*x**(1/2.4) - 0.055)

def limit(x):
    '''
    restricts x to interval [0, 1], maps x<0 to 0 and x>1 to 1
    '''
    return np.where(x < 0, 0, np.where(x > 1, 1, x))