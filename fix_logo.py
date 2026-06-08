from PIL import Image, ImageDraw

def make_circular_transparent(img_path, output_path):
    # Mở ảnh và chuyển sang chế độ có kênh Alpha (trong suốt)
    img = Image.open(img_path).convert("RGBA")
    
    # Tạo một mask (mặt nạ) màu đen (0) cùng kích thước
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    
    w, h = img.size
    diameter = min(w, h)
    
    # Tính tâm ảnh
    cx, cy = w // 2, h // 2
    
    # Bán kính hình tròn (thu nhỏ lại 1-2 pixel để cắt sạch viền rác)
    r = (diameter // 2) - 2
    
    # Vẽ hình tròn màu trắng (255) lên mặt nạ đen
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    
    # Áp dụng mask: Phần trắng sẽ giữ lại ảnh, phần đen sẽ bị làm trong suốt
    result = img.copy()
    result.putalpha(mask)
    
    # Cắt (Crop) ảnh lại cho thành hình vuông vừa khít hình tròn
    result = result.crop((cx - r, cy - r, cx + r, cy + r))
    
    result.save(output_path)

if __name__ == "__main__":
    make_circular_transparent("public/logo.png", "public/logo.png")
    print("Fixed logo successfully!")
