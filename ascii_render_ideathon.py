from PIL import Image
import numpy as np

def ascii_render(path):
    try:
        img = Image.open(path).resize((80, 40)).convert('L')
        pixels = np.array(img, dtype=float)
        pmin, pmax = np.min(pixels), np.max(pixels)
        if pmax > pmin:
            pixels = (pixels - pmin) / (pmax - pmin) * 255
        chars = np.array(list(' `.-_:,;^=~\'+*!|\\/?"<>[]{}o0OQ@#'))
        print(f'\n=== {path} ===')
        for row in pixels:
            idx = (row / 255) * (len(chars) - 1)
            print(''.join(chars[idx.astype(int)]))
    except Exception as e:
        print(f"Error on {path}: {e}")

for i in range(1, 6):
    ascii_render(f"public/Docs/IDEATHON{i}.webp")
