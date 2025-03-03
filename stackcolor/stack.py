from .utils import *
import copy

class Stack:
    '''
    takes a list (ordered from top down) of stack materials, list of # of layers, and simulates the color
    '''
    def __init__(self, materials, thicknesses, sio2_thickness=90e-9, color_model='human', light_temp=3000, intensity=1):
        # parameters
        self.T = light_temp # K
        self.intensity = intensity # light intensity

        # for later reference
        self.stack_materials = materials
        self.stack_layers = thicknesses

        # set basis of assembly, sandwich materials between air and chip
        for material in materials:
            if material not in MATERIALS:
                raise ValueError(f'material {material} not in accepted materials {MATERIALS}')
        self.materials = ['air'] + materials + ['sio2', 'si']
        # air and si are incident medium & substrate -> no thicknesses
        self.thicknesses = np.array([lattice_c_dict[materials[i]]*thicknesses[i] for i in range(len(materials))] + [sio2_thickness])

        # get physical constants
        self.refr = self._construct_refr()

        # calculate color
        color_models = {'human': human_lin_rgb, 'moticam s6': motics6_lin_rgb}
        self.color_model = color_models[color_model]
        self.raw_rgb = self.color_model(self._calculate_reflectance, self.T)
    
    def __mul__(self, other):
        '''
        multiplication defined between positive numbers and the stack, yields sRGB of stack
        '''
        if isinstance(other, (int, float, np.number)):
            if other < 0:
                raise ValueError(f'negative light intensitiy {other} is nonsensical')
            new_stack = copy.copy(self)
            new_stack.intensity *= other
            return new_stack.rgb()
        return NotImplemented
    

    def __rmul__(self, other):
        '''
        same as __mul__, numbers and stacks commute :)
        '''
        return self.__mul__(other)


    def rgb(self):
        '''
        converts the "raw linear RGB" to sRGB by applying gamma function and limiting [0, 1]
        '''
        return limit(gamma(self.raw_rgb * self.intensity))


    def _construct_refr(self):
        '''
        fetches indices of refraction in an array ordered like the stack
        '''
        return lambda l: np.array([refr_dict[material](l) for material in self.materials])
    

    def _calculate_reflectance(self, l):
        '''
        constructs our assemblence of thin films, calculates R for a given lambda
        '''
        # constants
        mu0 = 4*np.pi*1e-7
        e0 = 8.8541878128e-12

        N = self.refr(l)
        eta = N*np.sqrt(e0/mu0)
        vec = np.transpose(np.array([1, eta[-1]]))
        
        # multiply by all the thin film matrices
        thin_films = len(self.materials) - 2
        for i in range(thin_films):
            mat_i = -2 - i
            d_i = -1 - i
            delta = 2*np.pi*N[mat_i]*self.thicknesses[d_i]/l
            matr = np.array([[np.cos(delta), (1j*np.sin(delta))/eta[mat_i]],
                             [(1j*np.sin(delta))*eta[mat_i], np.cos(delta)]])
            vec = np.matmul(matr, vec)
        vec = np.transpose(vec)

        Y = vec[1]/vec[0]
        R = (eta[0]-Y)/(eta[0]+Y)

        return np.real(R*np.conjugate(R))

    






