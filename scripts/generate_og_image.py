import os
from PIL import Image, ImageDraw, ImageFont

def create_og_image():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), color=(17, 17, 18)) # #111112
    draw = ImageDraw.Draw(img)

    # Fonts
    font_georgia_bold_large = ImageFont.truetype(r"C:\Windows\Fonts\georgiab.ttf", 66)
    font_segoe_bold = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 24)
    font_segoe_brand = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 16)
    font_segoe_regular = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 19)
    font_segoe_sub = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 15)
    font_mono = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 14)
    font_mono_small = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 12)
    font_mono_bold = ImageFont.truetype(r"C:\Windows\Fonts\consolab.ttf", 13)

    # Colors
    c_bg = (17, 17, 18)
    c_border = (38, 38, 40)
    c_accent = (212, 90, 42) # #D45A2A
    c_accent_bg = (30, 21, 18)
    c_accent_border = (65, 33, 20)
    c_white = (250, 249, 246)
    c_muted = (158, 157, 152)
    c_dim = (110, 109, 104)
    c_tag_bg = (25, 25, 27)
    c_tag_border = (45, 45, 48)
    c_tag_text = (200, 199, 194)

    # 1. Inset architectural frame
    draw.rectangle([32, 32, W - 33, H - 33], outline=c_border, width=1)

    # Corner crosshair marks
    tick = 8
    # Top-left
    draw.line([(32 - tick, 32), (32 + tick, 32)], fill=(80, 80, 85), width=1)
    draw.line([(32, 32 - tick), (32, 32 + tick)], fill=(80, 80, 85), width=1)
    # Top-right
    draw.line([(W - 33 - tick, 32), (W - 33 + tick, 32)], fill=(80, 80, 85), width=1)
    draw.line([(W - 33, 32 - tick), (W - 33, 32 + tick)], fill=(80, 80, 85), width=1)
    # Bottom-left
    draw.line([(32 - tick, H - 33), (32 + tick, H - 33)], fill=(80, 80, 85), width=1)
    draw.line([(32, H - 33 - tick), (32, H - 33 + tick)], fill=(80, 80, 85), width=1)
    # Bottom-right
    draw.line([(W - 33 - tick, H - 33), (W - 33 + tick, H - 33)], fill=(80, 80, 85), width=1)
    draw.line([(W - 33, H - 33 - tick), (W - 33, H - 33 + tick)], fill=(80, 80, 85), width=1)

    # 2. Top Header
    # Accent indicator
    draw.rectangle([72, 68, 80, 76], fill=c_accent)
    # Brand title
    draw.text((92, 65), "SHIVSASTRA", fill=c_white, font=font_segoe_brand)
    # Monospace colophon
    header_right_text = "ENGINEERING HQ · STUDIO"
    bbox_hr = font_mono.getbbox(header_right_text)
    hr_w = bbox_hr[2] - bbox_hr[0]
    draw.text((W - 72 - hr_w, 66), header_right_text, fill=c_dim, font=font_mono)

    # Header divider
    draw.line([(72, 104), (W - 72, 104)], fill=(28, 28, 30), width=1)

    # 3. Eyebrow badge
    eyebrow_text = "AI AGENTS · BACKEND SYSTEMS · SOFTWARE SECURITY"
    eb_bbox = font_mono_bold.getbbox(eyebrow_text)
    eb_w = eb_bbox[2] - eb_bbox[0]
    eb_h = eb_bbox[3] - eb_bbox[1]
    eb_x, eb_y = 72, 142
    draw.rectangle([eb_x, eb_y, eb_x + eb_w + 20, eb_y + eb_h + 12], fill=c_accent_bg, outline=c_accent_border, width=1)
    draw.text((eb_x + 10, eb_y + 6), eyebrow_text, fill=c_accent, font=font_mono_bold)

    # 4. Central Identity
    draw.text((72, 192), "SHIVAM SHUKLA", fill=c_white, font=font_georgia_bold_large)

    draw.text((72, 290), "Backend Systems  ·  Agentic AI  ·  AI Security", fill=c_accent, font=font_segoe_bold)

    body_desc = (
        "Personal digital headquarters, production-grade system architecture case studies,\n"
        "and verified developer digital releases."
    )
    draw.multiline_text((72, 342), body_desc, fill=c_muted, font=font_segoe_regular, spacing=8)

    # 5. Technical tags
    tags = [
        "Java 17/21 & Spring Boot",
        "Deterministic Rules Engine",
        "Agentic AI & Tool-Calling",
        "Supabase RLS & Payment Security"
    ]
    cur_x = 72
    tag_y = 435
    for tag in tags:
        t_bbox = font_mono_small.getbbox(tag)
        t_w = t_bbox[2] - t_bbox[0]
        t_h = t_bbox[3] - t_bbox[1]
        draw.rectangle([cur_x, tag_y, cur_x + t_w + 16, tag_y + t_h + 10], fill=c_tag_bg, outline=c_tag_border, width=1)
        draw.text((cur_x + 8, tag_y + 5), tag, fill=c_tag_text, font=font_mono_small)
        cur_x += t_w + 28

    # 6. Bottom Colophon
    draw.line([(72, 516), (W - 72, 516)], fill=c_border, width=1)

    url_text = "https://www.jiosi.online"
    draw.text((72, 544), url_text, fill=c_dim, font=font_mono)

    cta_text = "Architecture Case Studies & Releases →"
    bbox_cta = font_segoe_sub.getbbox(cta_text)
    cta_w = bbox_cta[2] - bbox_cta[0]
    draw.text((W - 72 - cta_w, 542), cta_text, fill=c_white, font=font_segoe_sub)

    # Output path
    output_path = os.path.abspath(r"c:\Users\thesh\OneDrive\Desktop\ShivaShastra\public\og-image.png")
    img.save(output_path, format="PNG", optimize=True)
    print(f"Generated {output_path} successfully ({img.size[0]}x{img.size[1]} px).")

if __name__ == "__main__":
    create_og_image()
