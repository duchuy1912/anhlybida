from PIL import Image, ImageDraw

def fix_logo():
    img = Image.open("public/logo.png").convert("RGBA")
    pixels = img.load()
    w, h = img.size

    cx, cy = w // 2, h // 2
    radius = 0
    
    # Tìm viền của logo (bỏ qua phần caro xám/trắng)
    for x in range(0, cx):
        r, g, b, a = pixels[x, cy]
        # Nền caro thường có màu sáng (RGB > 180). 
        # Cạnh của logo (màu vàng/xanh) sẽ tối hơn.
        if a > 0 and (r < 200 or g < 200 or b < 180):
            radius = cx - x
            break
            
    print("Detected real logo radius:", radius)
    
    # Thu nhỏ bán kính 1 pixel để cắt sạch rác
    radius -= 1

    if radius <= 0:
        print("Could not detect logo bounds properly.")
        return

    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=255)

    result = img.copy()
    result.putalpha(mask)

    result = result.crop((cx - radius, cy - radius, cx + radius, cy + radius))
    result.save("public/logo.png")

if __name__ == "__main__":
    fix_logo()
