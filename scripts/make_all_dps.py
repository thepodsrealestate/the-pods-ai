from PIL import Image
import os

cwd = os.getcwd()
src = os.path.join(cwd, 'public', 'logo_black.jpeg')

if os.path.exists(src):
    img = Image.open(src).convert('RGB')
    w, h = img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    right = left + min_dim
    bottom = top + min_dim
    cropped = img.crop((left, top, right, bottom))
    
    # 1. 500x500 JPG
    p500_jpg = os.path.join(cwd, 'public', 'the_pods_500.jpg')
    cropped.resize((500, 500), Image.Resampling.LANCZOS).save(p500_jpg, 'JPEG', quality=90, optimize=True)
    
    # 2. 500x500 PNG
    p500_png = os.path.join(cwd, 'public', 'the_pods_500.png')
    cropped.resize((500, 500), Image.Resampling.LANCZOS).save(p500_png, 'PNG', optimize=True)
    
    # 3. 640x640 PNG
    p640_png = os.path.join(cwd, 'public', 'the_pods_640.png')
    cropped.resize((640, 640), Image.Resampling.LANCZOS).save(p640_png, 'PNG', optimize=True)
    
    print('Generated:', p500_jpg, os.path.getsize(p500_jpg), 'bytes')
    print('Generated:', p500_png, os.path.getsize(p500_png), 'bytes')
    print('Generated:', p640_png, os.path.getsize(p640_png), 'bytes')
