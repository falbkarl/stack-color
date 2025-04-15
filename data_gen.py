from stackcolor import Stack
import numpy as np
from multiprocess import Pool
import os

sio2_thicknesses = (0, 90, 100, 285) #nm
materials = {'graphite':('graphite', 150), 'hbn':('h-BN', 600), 'wse2':('WSe2', 300)} # material: (nice name, max_layers)

def get_rgb(flake, layers, sio2, light_t):
    return Stack([flake], [layers], sio2_thickness=sio2, light_temp=light_t).raw_rgb

temp_steps = 36
temp_range = (2000, 5500)
t = np.linspace(temp_range[0], temp_range[1], temp_steps)
for material in materials.keys():
    for sio2 in sio2_thicknesses:
        nice_name, n_layers = materials[material]
        # check to ensure I'm not rerunning anything
        if os.path.exists(f'./docs/data/r_{nice_name}_{sio2}.csv'):
            print(f'found {material} on {sio2}nm -- skipping')
            continue
        print(f'running {material} on {sio2}nm')
        d = np.arange(n_layers+1)
        D, T = np.meshgrid(d, t)
        D_flat, T_flat = D.flatten(), T.flatten()
        flattened_colors = lambda index: get_rgb(material, D_flat[index], sio2*1e-9, T_flat[index])

        pool = Pool(processes=9)
        size = temp_steps*len(d)
        results = np.array(pool.map(flattened_colors, range(0, size))).reshape((temp_steps, len(d), 3))

        red, green, blue = results[:,:,0], results[:,:,1], results[:,:,2]
        np.savetxt(f'./docs/data/r_{nice_name}_{sio2}.csv', red.astype(float), fmt='%s', delimiter=",")
        np.savetxt(f'./docs/data/g_{nice_name}_{sio2}.csv', green.astype(float), fmt='%s', delimiter=",")
        np.savetxt(f'./docs/data/b_{nice_name}_{sio2}.csv', blue.astype(float), fmt='%s', delimiter=",")
