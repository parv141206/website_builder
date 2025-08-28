// src/components/core/craft/primitives/Orb.tsx
"use client";
import React, { useEffect, useRef, useMemo, useState } from "react"; // Added useState
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
import { useNode } from "@craftjs/core";

export interface OrbProps {
  color1?: string;
  color2?: string;
  color3?: string;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  width?: string;
  height?: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  className?: string; // ADDED: className prop
  position?: "absolute" | "relative" | "fixed" | "static"; // ADDED: position prop
  zIndex?: string; // ADDED: zIndex prop
}

export const Orb: React.FC<OrbProps> & { craft?: any } = ({
  color1 = "#9c43ff",
  color2 = "#4cd4e8",
  color3 = "#101499",
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
  width = "300px",
  height = "300px",
  top = "auto",
  bottom = "auto",
  left = "auto",
  right = "auto",
  className, // DESTRUCTURED: className
  position = "absolute", // DESTRUCTURED: position
  zIndex = "auto", // DESTRUCTURED: zIndex
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const ctnDom = useRef<HTMLDivElement>(null);

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
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;

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
      vec3 color1 = uColor1;
      vec3 color2 = uColor2;
      vec3 color3 = uColor3;
      
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
      container.appendChild(gl.canvas as any);
      // @ts-ignore
      const geometry = new Triangle(gl);
      // @ts-ignore
      program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms: {
          iTime: { value: 0 },
          iResolution: {
            value: new Vec3(0, 0, 1),
          },
          hover: { value: 0 },
          rot: { value: 0 },
          hoverIntensity: { value: hoverIntensity },
          uColor1: { value: hexToRgb(color1) },
          uColor2: { value: hexToRgb(color2) },
          uColor3: { value: hexToRgb(color3) },
        },
      });
      // @ts-ignore
      mesh = new Mesh(gl, { geometry, program });
    } catch (e) {
      console.error("Failed to initialize OGL context:", e);
      return;
    }

    const { uniforms } = program;

    function resize() {
      if (!container || !renderer || !uniforms.iResolution.value) return;
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr);
      // @ts-ignore
      gl!.canvas.style.width = width + "px";
      // @ts-ignore
      gl!.canvas.style.height = height + "px";
      uniforms.iResolution.value.set(
        gl!.canvas.width,
        gl!.canvas.height,
        gl!.canvas.width / gl!.canvas.height,
      );
    }

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
      uniforms.hoverIntensity.value = hoverIntensity;
      uniforms.uColor1.value = hexToRgb(color1);
      uniforms.uColor2.value = hexToRgb(color2);
      uniforms.uColor3.value = hexToRgb(color3);

      const effectiveHover = forceHoverState ? 1 : targetHover;
      uniforms.hover.value += (effectiveHover - uniforms.hover.value) * 0.1;

      if (rotateOnHover && effectiveHover > 0.5) {
        currentRot += dt * rotationSpeed;
      }
      uniforms.rot.value = currentRot;

      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (gl && gl.canvas && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas as any);
      }
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color1, color2, color3, hoverIntensity, rotateOnHover, forceHoverState]);

  // Combined class names
  const finalClassNames = useMemo(() => {
    const classes = [className];
    if (selected) {
      classes.push(
        "outline-2",
        "outline-dashed",
        "outline-blue-500",
        "outline-offset-2",
      );
    }
    return classes.filter(Boolean).join(" ");
  }, [className, selected]);

  const style: React.CSSProperties = useMemo(
    () => ({
      position: position, // Use the new position prop
      width: width,
      height: height,
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      zIndex: zIndex, // Use the new zIndex prop
      // Outline moved to className
    }),
    [width, height, top, bottom, left, right, position, zIndex],
  );

  return (
    <div
      ref={(el) => {
        if (el) {
          connect(drag(el));
          ctnDom.current = el;
        }
      }}
      className={finalClassNames} // Apply combined classes
      style={style}
    />
  );
};

function hexToRgb(hex: string): Vec3 {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? new Vec3(
        parseInt(result[1]!, 16) / 255,
        parseInt(result[2]!, 16) / 255,
        parseInt(result[3]!, 16) / 255,
      )
    : new Vec3(1, 0, 0); // Default to red if invalid
}

Orb.craft = {
  displayName: "Orb",
  props: {
    color1: "#9c43ff",
    color2: "#4cd4e8",
    color3: "#101499",
    hoverIntensity: 0.2,
    rotateOnHover: true,
    forceHoverState: false,
    width: "300px",
    height: "300px",
    top: "auto",
    bottom: "auto",
    left: "auto",
    right: "auto",
    className: "", // ADDED: Default empty string
    position: "absolute", // ADDED: Default position
    zIndex: "auto", // ADDED: Default zIndex
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
              key: "color1",
              type: "color",
              label: "Color 1",
            },
            {
              key: "color2",
              type: "color",
              label: "Color 2",
            },
            {
              key: "color3",
              type: "color",
              label: "Color 3",
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
            {
              key: "position",
              type: "select",
              label: "Position",
              options: ["absolute", "relative", "fixed", "static"],
            },
            { key: "zIndex", type: "text", label: "Z-Index" },
          ],
        },
      ],
    },
  },
};
