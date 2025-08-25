"use client";
import React, { useEffect, useRef, useMemo } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
import { useNode } from "@craftjs/core";

export interface OrbProps {
  baseColor1?: string;
  baseColor2?: string;
  baseColor3?: string;
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  width?: string;
  height?: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

export const Orb: React.FC<OrbProps> & { craft?: any } = ({
  baseColor1 = "#9c43ff",
  baseColor2 = "#4cd4e8",
  baseColor3 = "#101499",
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
  width = "300px",
  height = "300px",
  top = "auto",
  bottom = "auto",
  left = "auto",
  right = "auto",
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const ctnDom = useRef<HTMLDivElement>(null);

  // --- GLSL Shaders ---
  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = /* glsl */ `
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform float uBaseColor1R;
    uniform float uBaseColor1G;
    uniform float uBaseColor1B;
    uniform float uBaseColor2R;
    uniform float uBaseColor2G;
    uniform float uBaseColor2B;
    uniform float uBaseColor3R;
    uniform float uBaseColor3G;
    uniform float uBaseColor3B;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }
    
    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }
    
    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }
    
    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }
    
    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }
    
    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }
    
    
    const float innerRadius = 0.6;
    const float noiseScale = 0.65;
    
    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }
    
    vec4 draw(vec2 uv) {
      vec3 uBaseColor1 = vec3(uBaseColor1R, uBaseColor1G, uBaseColor1B);
      vec3 uBaseColor2 = vec3(uBaseColor2R, uBaseColor2G, uBaseColor2B);
      vec3 uBaseColor3 = vec3(uBaseColor3R, uBaseColor3G, uBaseColor3B);
      
      vec3 color1 = adjustHue(uBaseColor1, hue);
      vec3 color2 = adjustHue(uBaseColor2, hue);
      vec3 color3 = adjustHue(uBaseColor3, hue);
      
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;
      
      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);
      v0 *= smoothstep(r0 * 1.05, r0, len);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
      
      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.5, 5.0, d);
      v1 *= light1(1.0, 50.0, d0);
      
      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
      
      vec3 col = mix(color1, color2, cl);
      col = mix(color3, col, v0);
      col = (col + v1) * v2 * v3;
      col = clamp(col, 0.0, 1.0);
      
      return extractAlpha(col);
    }
    
    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      
      uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
      
      return draw(uv);
    }
    
    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;
  // --- END GLSL Shaders ---

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let gl: WebGLRenderingContext | null = null;
    let program: Program | null = null;
    let mesh: Mesh<Triangle> | null = null;
    let rafId: number;

    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
      gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      container.appendChild(gl.canvas);

      const geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms: {
          iTime: { value: 0 },
          iResolution: {
            value: new Vec3(0, 0, 1),
          },
          hue: { value: hue },
          hover: { value: 0 },
          rot: { value: 0 },
          hoverIntensity: { value: hoverIntensity },
          uBaseColor1R: { value: 0 },
          uBaseColor1G: { value: 0 },
          uBaseColor1B: { value: 0 },
          uBaseColor2R: { value: 0 },
          uBaseColor2G: { value: 0 },
          uBaseColor2B: { value: 0 },
          uBaseColor3R: { value: 0 },
          uBaseColor3G: { value: 0 },
          uBaseColor3B: { value: 0 },
        },
      });

      mesh = new Mesh(gl, { geometry, program });
    } catch (e) {
      console.error("Failed to initialize OGL context:", e);
      return; // Exit if initialization fails
    }

    const { uniforms } = program;

    function resize() {
      if (!container || !renderer || !uniforms.iResolution.value) return;
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr);
      gl!.canvas.style.width = width + "px";
      gl!.canvas.style.height = height + "px";
      uniforms.iResolution.value.set(
        gl!.canvas.width,
        gl!.canvas.height,
        gl!.canvas.width / gl!.canvas.height,
      );
    }

    // Use ResizeObserver for more efficient resizing in component contexts
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let targetHover = 0;
    let lastTime = 0;
    let currentRot = 0;
    const rotationSpeed = 0.3;

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      const size = Math.min(width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const uvX = ((x - centerX) / size) * 2.0;
      const uvY = ((y - centerY) / size) * 2.0;

      if (Math.sqrt(uvX * uvX + uvY * uvY) < 0.8) {
        targetHover = 1;
      } else {
        targetHover = 0;
      }
    };

    const handleMouseLeave = () => {
      targetHover = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    const update = (t: number) => {
      rafId = requestAnimationFrame(update);

      if (!uniforms || !renderer || !mesh) return;

      const dt = (t - lastTime) * 0.001;
      lastTime = t;
      uniforms.iTime.value = t * 0.001;

      // Update all uniforms in the animation loop to ensure they stay in sync
      uniforms.hue.value = hue;
      uniforms.hoverIntensity.value = hoverIntensity;

      // Update colors directly as individual float uniforms
      const color1 = hexToRgb(baseColor1);
      const color2 = hexToRgb(baseColor2);
      const color3 = hexToRgb(baseColor3);

      uniforms.uBaseColor1R.value = color1[0];
      uniforms.uBaseColor1G.value = color1[1];
      uniforms.uBaseColor1B.value = color1[2];

      uniforms.uBaseColor2R.value = color2[0];
      uniforms.uBaseColor2G.value = color2[1];
      uniforms.uBaseColor2B.value = color2[2];

      uniforms.uBaseColor3R.value = color3[0];
      uniforms.uBaseColor3G.value = color3[1];
      uniforms.uBaseColor3B.value = color3[2];

      // Smooth hover state interpolation
      const effectiveHover = forceHoverState ? 1 : targetHover;
      uniforms.hover.value += (effectiveHover - uniforms.hover.value) * 0.1;

      // Rotation based on prop and hover state
      if (rotateOnHover && effectiveHover > 0.5) {
        currentRot += dt * rotationSpeed;
      }
      uniforms.rot.value = currentRot;

      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(update);

    // Cleanup function
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (container && gl?.canvas) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        // Safely attempt removal of canvas
        if (container.contains(gl.canvas)) {
          container.removeChild(gl.canvas);
        }
      }
      // Attempt to lose context if available
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    baseColor1,
    baseColor2,
    baseColor3,
    hue,
    hoverIntensity,
    rotateOnHover,
    forceHoverState,
  ]);

  const style: React.CSSProperties = useMemo(
    () => ({
      position: "absolute",
      width: width,
      height: height,
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      outline: selected ? "2px dashed #4c8bf5" : "none",
      outlineOffset: "2px",
    }),
    [selected, width, height, top, bottom, left, right],
  );

  return (
    <div
      ref={(el) => {
        if (el) {
          connect(drag(el));
          ctnDom.current = el;
        }
      }}
      style={style}
    />
  );
};

// Helper function to convert hex color to RGB array
const hexToRgb = (hex: string): [number, number, number] => {
  // Clean the hex string
  const cleanHex = hex.replace("#", "");

  // Parse RGB values
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  // Log for debugging
  console.log(
    `Converting ${hex} -> R:${r.toFixed(3)} G:${g.toFixed(3)} B:${b.toFixed(3)}`,
  );

  return [r, g, b];
};

Orb.craft = {
  displayName: "Orb",
  props: {
    baseColor1: "#9c43ff",
    baseColor2: "#4cd4e8",
    baseColor3: "#101499",
    hue: 270,
    hoverIntensity: 0.2,
    rotateOnHover: true,
    forceHoverState: false,
    width: "300px",
    height: "300px",
    top: "auto",
    bottom: "auto",
    left: "auto",
    right: "auto",
  },
  rules: {
    canDrag: () => true,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Orb Style",
          fields: [
            {
              key: "baseColor1",
              type: "color",
              label: "Base Color 1",
            },
            {
              key: "baseColor2",
              type: "color",
              label: "Base Color 2",
            },
            {
              key: "baseColor3",
              type: "color",
              label: "Base Color 3",
            },
            {
              key: "hue",
              type: "number",
              label: "Hue Rotation (°)",
              min: 0,
              max: 360,
              step: 1,
            },
            {
              key: "hoverIntensity",
              type: "number",
              label: "Hover Distortion",
              min: 0,
              max: 1,
              step: 0.05,
            },
          ],
        },
        {
          label: "Interaction",
          fields: [
            {
              key: "rotateOnHover",
              type: "boolean",
              label: "Rotate on Hover",
            },
            {
              key: "forceHoverState",
              type: "boolean",
              label: "Force Hover State (Editor Preview)",
            },
          ],
        },
        {
          label: "Position & Size",
          fields: [
            { key: "width", type: "text", label: "Width" },
            { key: "height", type: "text", label: "Height" },
            { key: "top", type: "text", label: "Top" },
            { key: "bottom", type: "text", label: "Bottom" },
            { key: "left", type: "text", label: "Left" },
            { key: "right", type: "text", label: "Right" },
          ],
        },
      ],
    },
  },
};
