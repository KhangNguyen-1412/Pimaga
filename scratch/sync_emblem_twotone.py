import math
import os

def generate_twotone_svg():
    cx, cy = 256, 256

    # 1. Golden Spiral calculation (Fibonacci logarithmic curve)
    spiral_points = []
    for t_deg in range(0, 780, 5):
        theta = math.radians(t_deg)
        r = 10 * math.exp(0.185 * theta)
        if r > 195:
            break
        # Rotate by -45 degrees for harmonious composition
        rot = theta - math.radians(45)
        x = cx + r * math.cos(rot)
        y = cy + r * math.sin(rot)
        spiral_points.append(f"{x:.1f},{y:.1f}")

    spiral_path_d = "M " + " L ".join(spiral_points)

    # 2. 36 Astrolabe ticks around R = 216 strictly Cerulean & Slate
    ticks_svg = []
    for i in range(36):
        angle = math.radians(i * 10)
        r_outer = 216
        is_major = (i % 3 == 0)
        r_inner = 202 if is_major else 209
        x1 = cx + r_inner * math.cos(angle)
        y1 = cy + r_inner * math.sin(angle)
        x2 = cx + r_outer * math.cos(angle)
        y2 = cy + r_outer * math.sin(angle)
        stroke_color = "#2A52BE" if is_major else "#64748B"
        opacity = "0.85" if is_major else "0.3"
        stroke_width = "2.0" if is_major else "1.0"
        ticks_svg.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke_color}" stroke-opacity="{opacity}" stroke-width="{stroke_width}" />')

    # 3. Constellation nodes at Golden Angles (137.508 deg) - alternating Cerulean & Jasper
    constellation_svg = []
    for i in range(1, 12):
        angle = math.radians(i * 137.508)
        r = 60 + i * 11
        if r > 200: continue
        px = cx + r * math.cos(angle)
        py = cy + r * math.sin(angle)
        color = "#2A52BE" if i % 2 == 0 else "#D73B3E"
        size = 1.8 if i % 3 != 0 else 2.5
        constellation_svg.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{size}" fill="{color}" opacity="0.8" />')

    ticks_str = "\n      ".join(ticks_svg)
    constellation_str = "\n      ".join(constellation_svg)

    # 4. Mathematically proportioned, classical serif Pi components:
    path_crossbar = 'M 120,166 C 126,156 138,150 154,150 L 366,150 C 382,150 392,158 392,168 C 392,176 384,180 374,178 L 360,178 L 148,176 C 136,176 128,180 122,180 C 116,180 114,174 120,166 Z'
    path_left_stem = 'M 184,176 L 216,176 L 216,334 C 216,344 224,350 234,352 L 166,352 C 176,350 184,344 184,334 Z'
    path_right_stem = 'M 296,176 L 328,176 L 328,302 C 328,322 340,336 360,342 C 374,346 388,342 394,330 C 398,320 392,312 384,314 C 376,316 372,326 360,326 C 344,326 334,316 330,298 L 328,176 Z'

    pi_combined_paths = f'''
        <path d="{path_crossbar}" />
        <path d="{path_left_stem}" />
        <path d="{path_right_stem}" />
    '''

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Deep Dimensional Outer Drop Shadow -->
    <filter id="chassis-shadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#020617" flood-opacity="0.75" />
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#0F172A" flood-opacity="0.45" />
    </filter>

    <!-- 3D Pi Symbol Deep Drop Shadow & Ambient Occlusion -->
    <filter id="pi-depth-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000000" flood-opacity="0.85" />
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0F172A" flood-opacity="0.65" />
    </filter>

    <!-- Ethereal Glow Filter for Neon Accents -->
    <filter id="neon-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Outer Dual-Tone Neon Ring (Strict Cerulean #2A52BE to Jasper #D73B3E) -->
    <linearGradient id="neon-perimeter" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2A52BE" />
      <stop offset="45%" stop-color="#1E40AF" />
      <stop offset="55%" stop-color="#BE123C" />
      <stop offset="100%" stop-color="#D73B3E" />
    </linearGradient>

    <!-- Dark Titanium Chassis Chamfer -->
    <linearGradient id="titanium-rim" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="30%" stop-color="#1E293B" />
      <stop offset="70%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>

    <!-- Deep Cosmic Dial Core (Volumetric Obsidian/Midnight Ink) -->
    <radialGradient id="dial-core" cx="36%" cy="30%" r="72%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="25%" stop-color="#0F172A" />
      <stop offset="65%" stop-color="#060A14" />
      <stop offset="100%" stop-color="#020408" />
    </radialGradient>

    <!-- Cerulean Atmospheric Aurora Bloom (Top Left) -->
    <radialGradient id="cerulean-aurora" cx="20%" cy="20%" r="65%">
      <stop offset="0%" stop-color="#2A52BE" stop-opacity="0.5" />
      <stop offset="40%" stop-color="#1D4ED8" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#1E3A8A" stop-opacity="0" />
    </radialGradient>

    <!-- Jasper Crimson Celestial Bloom (Bottom Right) -->
    <radialGradient id="jasper-aurora" cx="82%" cy="80%" r="55%">
      <stop offset="0%" stop-color="#D73B3E" stop-opacity="0.45" />
      <stop offset="45%" stop-color="#BE123C" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#881337" stop-opacity="0" />
    </radialGradient>

    <!-- Dual-Tone Golden Spiral Gradient (Cerulean to Jasper) -->
    <linearGradient id="golden-spiral-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2A52BE" />
      <stop offset="40%" stop-color="#3B82F6" />
      <stop offset="65%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#D73B3E" />
    </linearGradient>

    <!-- 3D Pi Front Face: Polished Lustrous Platinum / Diamond Sheen -->
    <linearGradient id="pi-face-platinum" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="30%" stop-color="#F8FAFC" />
      <stop offset="65%" stop-color="#E2E8F0" />
      <stop offset="85%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>

    <!-- 3D Pi Side Extrusion (Cerulean to Deep Obsidian) -->
    <linearGradient id="pi-side-ext" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2A52BE" />
      <stop offset="40%" stop-color="#1E3A8A" />
      <stop offset="80%" stop-color="#172554" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>

    <!-- 3D Pi Right Stem Side Wall (Cerulean into Jasper Crimson) -->
    <linearGradient id="pi-right-side" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2A52BE" />
      <stop offset="45%" stop-color="#1D4ED8" />
      <stop offset="75%" stop-color="#BE123C" />
      <stop offset="100%" stop-color="#D73B3E" />
    </linearGradient>

    <!-- Razor Bevel Specular Edge Highlight -->
    <linearGradient id="bevel-gleam" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="35%" stop-color="#DBEAFE" stop-opacity="0.85" />
      <stop offset="70%" stop-color="#FEE2E2" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95" />
    </linearGradient>

    <!-- Glass Dome Caustic / Glare Highlight -->
    <linearGradient id="glass-curvature" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.38" />
      <stop offset="25%" stop-color="#2A52BE" stop-opacity="0.1" />
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Base 3D Group with Floating Shadow -->
  <g filter="url(#chassis-shadow)">
    
    <!-- 1. Outer Titanium Chassis Ring -->
    <circle cx="256" cy="256" r="240" fill="url(#titanium-rim)" />

    <!-- 2. Radiant Neon Halo Perimeter (Cerulean -> Jasper) -->
    <circle cx="256" cy="256" r="236" fill="none" stroke="url(#neon-perimeter)" stroke-width="2.5" />

    <!-- 3. Dark Inset Bevel Ring -->
    <circle cx="256" cy="256" r="231" fill="#050B14" stroke="#0F172A" stroke-width="1.5" />

    <!-- 4. Main Dial Body (Obsidian / Midnight Sapphire) -->
    <circle cx="256" cy="256" r="224" fill="url(#dial-core)" />

    <!-- 5. Dual Atmospheric Nebula Glows -->
    <circle cx="256" cy="256" r="224" fill="url(#cerulean-aurora)" />
    <circle cx="256" cy="256" r="224" fill="url(#jasper-aurora)" />

    <!-- 6. Precision Mathematical Astrolabe / Coordinate Grid -->
    <g>
      <!-- Concentric Harmonic Circles -->
      <circle cx="256" cy="256" r="216" fill="none" stroke="#1E293B" stroke-width="1" />
      <circle cx="256" cy="256" r="180" fill="none" stroke="#2A52BE" stroke-width="0.8" stroke-opacity="0.35" stroke-dasharray="3 6" />
      <circle cx="256" cy="256" r="140" fill="none" stroke="#94A3B8" stroke-width="0.6" stroke-opacity="0.2" />
      <circle cx="256" cy="256" r="95" fill="none" stroke="#D73B3E" stroke-width="0.8" stroke-opacity="0.35" stroke-dasharray="4 8" />
      <circle cx="256" cy="256" r="55" fill="none" stroke="#2A52BE" stroke-width="1" stroke-opacity="0.3" />

      <!-- Astrolabe Degree Graduation Ticks -->
      {ticks_str}

      <!-- Coordinate Crosshair Rays with 2-Tone Accents -->
      <line x1="256" y1="46" x2="256" y2="466" stroke="#2A52BE" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="2 6" />
      <line x1="46" y1="256" x2="466" y2="256" stroke="#2A52BE" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="2 6" />
      <line x1="108" y1="108" x2="404" y2="404" stroke="#2A52BE" stroke-opacity="0.2" stroke-width="0.8" />
      <line x1="108" y1="404" x2="404" y2="108" stroke="#D73B3E" stroke-opacity="0.2" stroke-width="0.8" />

      <!-- Geometric Euler Constellation Points -->
      {constellation_str}
    </g>

    <!-- 7. Glowing Golden Ratio Spiral (Fibonacci Ribbon in Cerulean to Jasper) -->
    <path d="{spiral_path_d}" fill="none" stroke="url(#golden-spiral-grad)" stroke-width="2.2" stroke-linecap="round" opacity="0.75" filter="url(#neon-glow)" />

    <!-- 8. The 3D Sculptured Pi (π) Symbol -->
    <g filter="url(#pi-depth-shadow)">

      <!-- LAYER A: 3D Depth Extrusion Base (Deep Obsidian Drop 10px) -->
      <g fill="#020617" opacity="0.95" transform="translate(0, 8)">
        {pi_combined_paths}
      </g>

      <!-- LAYER B: 3D Beveled Lateral Walls (Cerulean -> Jasper dimensional gradient, offset 4px) -->
      <g fill="url(#pi-side-ext)" transform="translate(0, 4)">
        <path d="{path_crossbar}" />
        <path d="{path_left_stem}" />
      </g>
      <g fill="url(#pi-right-side)" transform="translate(0, 4)">
        <path d="{path_right_stem}" />
      </g>

      <!-- LAYER C: Chamfered Neon Bevel Edge Stroke (1.8px metallic rim) -->
      <g stroke="url(#bevel-gleam)" stroke-width="1.8" fill="none" stroke-linejoin="round">
        {pi_combined_paths}
      </g>

      <!-- LAYER D: 3D Pi Front Face (Radiant Lustrous Platinum / Titanium) -->
      <g fill="url(#pi-face-platinum)">
        {pi_combined_paths}
      </g>

      <!-- LAYER E: Razor Specular Glints & Reflections -->
      <!-- Epistyle Top Gleam -->
      <path d="M 148,152 L 360,152 C 374,152 384,156 388,162 L 130,162 C 134,156 140,152 148,152 Z" fill="#FFFFFF" opacity="0.7" />
      <!-- Left Stem Highlight Ridge -->
      <line x1="188" y1="178" x2="188" y2="330" stroke="#FFFFFF" stroke-width="1.2" opacity="0.45" stroke-linecap="round" />
      <!-- Right Stem Terminal Flare Curve -->
      <path d="M 334,310 C 344,320 354,324 366,322 C 376,320 382,312 384,314 C 378,322 368,326 358,326 C 346,326 338,318 334,310 Z" fill="#FFFFFF" opacity="0.8" />
    </g>

    <!-- 9. Ultra-Smooth Crystal Glass Dome Reflection -->
    <path d="M 56,210 C 86,110 162,56 256,56 C 350,56 426,110 456,210 C 376,140 296,120 216,130 C 146,138 90,170 56,210 Z" fill="url(#glass-curvature)" />

    <!-- 10. Inner Sapphire & Ruby Rim Specular Pinpoints -->
    <circle cx="256" cy="20" r="1.5" fill="#FFFFFF" opacity="0.9" />
    <circle cx="492" cy="256" r="1.5" fill="#D73B3E" opacity="0.9" />
    <circle cx="20" cy="256" r="1.5" fill="#2A52BE" opacity="0.9" />
  </g>
</svg>'''
    return svg

if __name__ == '__main__':
    svg_content = generate_twotone_svg()
    target = r'c:\Users\nhpk1\Documents\Code\Pimaga\assets\pimaga-logo.svg'
    with open(target, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"Emblem successfully regenerated at {target} ({len(svg_content)} bytes)")
