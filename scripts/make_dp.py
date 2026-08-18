from PIL import Image
import os

cwd = os.getcwd()
src = os.path.join(cwd, 'public', 'logo_black.jpeg')
out = os.path.join(cwd, 'public', 'the_pods_dp.jpg')

if os.path.exists(src):
    img = Image.open(src).convert('RGB')
    w, h = img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    right = left + min_dim
    bottom = top + min_dim
    cropped = img.crop((left, top, right, bottom))
    resized = cropped.resize((640, 640), Image.Resampling.LANCZOS)
    resized.save(out, 'JPEG', quality=95)
    print('Generated:', out)
