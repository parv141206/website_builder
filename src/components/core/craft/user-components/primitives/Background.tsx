// src/components/core/craft/user-components/primitives/Background.tsx
"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { useTheme } from "~/themes";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useNode } from "@craftjs/core"; // Import useNode

// ==================================================================================
// SECTION 1: FANCY BACKGROUND DEFINITIONS (ISOLATED)
// ==================================================================================

// Helper to convert hex to an "r, g, b" string for use in rgba().
const hexToRgb = (hex: string): string => {
  if (!hex || typeof hex !== "string") return "255, 255, 255";
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "255, 255, 255"; // Default to white if parsing fails
};

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
  baseColor?: string;
}

const Aurora: React.FC<AuroraProps> = ({
  colorStops = ["#5227FF", "#7cff67", "#5227FF"],
  amplitude = 1.0,
  blend = 0.5,
  baseColor = "transparent",
}) => {
  const propsRef = useRef<AuroraProps>({ colorStops, amplitude, blend });
  propsRef.current = { colorStops, amplitude, blend };

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = baseColor; // Set base color

    let program: Program | undefined;

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }
    window.addEventListener("resize", resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStopsArray = colorStops.map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      const { time = t * 0.01, speed = 1.0 } = propsRef.current;
      if (program) {
        program.uniforms.uTime.value = time * speed * 0.1;
        program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
        program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
        const stops = propsRef.current.colorStops ?? colorStops;
        program.uniforms.uColorStops.value = stops.map((hex: string) => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        });
        renderer.render({ scene: mesh });
      }
    };
    animateId = requestAnimationFrame(update);

    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, baseColor]);

  return <div ref={ctnDom} className="h-full w-full" />;
};

// Define the type for the background style function
type BackgroundStyleFn = (
  baseColor: string,
  patternColor: string,
  patternOpacity: number,
  patternSize: number,
) => React.CSSProperties;

// Modify the FANCY_BACKGROUNDS type to include a component
type FancyBackgroundDefinition =
  | {
      name: string;
      style: BackgroundStyleFn;
    }
  | {
      name: string;
      component: React.FC<AuroraProps>;
    };

// Update the FANCY_BACKGROUNDS record to use the new type
export const FANCY_BACKGROUNDS: Record<string, FancyBackgroundDefinition> = {
  graphGrid: {
    name: "Graph Grid",
    style: (baseColor, patternColor, patternOpacity, patternSize) => {
      const patternRgba = `rgba(${hexToRgb(patternColor)}, ${patternOpacity})`;
      return {
        backgroundImage: `
          linear-gradient(${patternRgba} 1px, transparent 1px),
          linear-gradient(90deg, ${patternRgba} 1px, transparent 1px)
        `,
        backgroundSize: `${patternSize}px ${patternSize}px`,
      };
    },
  },
  diagonalLines: {
    name: "Diagonal Lines",
    style: (baseColor, patternColor, patternOpacity, patternSize) => {
      const patternRgba = `rgba(${hexToRgb(patternColor)}, ${patternOpacity})`;
      return {
        backgroundColor: baseColor,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          ${patternRgba},
          ${patternRgba} 1px,
          transparent 1px,
          transparent ${patternSize}px
        )`,
      };
    },
  },
  dotGrid: {
    name: "Dot Grid",
    style: (baseColor, patternColor, patternOpacity, patternSize) => {
      const patternRgba = `rgba(${hexToRgb(patternColor)}, ${patternOpacity})`;
      return {
        backgroundColor: baseColor,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${patternRgba} 1px, transparent 0)`,
        backgroundSize: `${patternSize}px ${patternSize}px`,
      };
    },
  },
  concentricCircles: {
    name: "Concentric Circles",
    style: (baseColor, patternColor, patternOpacity, patternSize) => {
      const patternRgba = `rgba(${hexToRgb(patternColor)}, ${patternOpacity})`;
      return {
        backgroundColor: baseColor,
        backgroundImage: `repeating-radial-gradient(
              circle,
              ${patternRgba},
              ${patternRgba} 1px,
              transparent 1px,
              transparent ${patternSize}px
          )`,
      };
    },
  },
  aurora: {
    name: "Aurora",
    component: Aurora,
  },
};

// ==================================================================================
// SECTION 2: BACKGROUND COMPONENT (NEW PRIMITIVE)
// ==================================================================================

export interface BackgroundProps {
  backgroundType: string;
  backgroundColor?: string;
  patternColor?: string;
  patternOpacity?: number;
  patternSize?: number;
  amplitude?: number;
  blend?: number;
  auroraColorStops?: string[];
  width?: string;
  height?: string;
}

export const Background: React.FC<BackgroundProps> & { craft?: any } = ({
  backgroundType,
  backgroundColor,
  patternColor,
  patternOpacity,
  patternSize,
  amplitude,
  blend,
  auroraColorStops,
  width = "100%",
  height = "100%",
}) => {
  const {
    connectors: { connect, drag },
  } = useNode(); // Get connectors from useNode

  const theme = useTheme();

  const style: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      width: width,
      height: height,
      zIndex: -1, // Appear behind other content
      pointerEvents: "none", // Allow interaction with content above
    };

    const baseColor = backgroundColor || theme.colors.background.secondary;
    const finalPatternColor = patternColor || theme.colors.text.muted;
    const finalPatternOpacity = patternOpacity ?? 0.1;
    const finalPatternSize = patternSize ?? 20;

    const selectedBgFn = FANCY_BACKGROUNDS[backgroundType]?.style;

    if (selectedBgFn) {
      Object.assign(
        baseStyle,
        selectedBgFn(
          baseColor,
          finalPatternColor,
          finalPatternOpacity,
          finalPatternSize,
        ),
      );
    } else {
      baseStyle.background = backgroundColor || theme.colors.background.primary;
    }

    return baseStyle;
  }, [
    backgroundType,
    backgroundColor,
    patternColor,
    patternOpacity,
    patternSize,
    theme,
    width,
    height,
  ]);

  const BackgroundComponent = FANCY_BACKGROUNDS[backgroundType]?.component;

  return (
    <div ref={(ref: any) => connect(drag(ref))} style={style}>
      {BackgroundComponent && (
        <BackgroundComponent
          colorStops={auroraColorStops}
          amplitude={amplitude}
          blend={blend}
          baseColor={backgroundColor}
        />
      )}
    </div>
  );
};

// ==================================================================================
// SECTION 3: CRAFT.JS CONFIGURATION (FOR ISOLATED PRIMITIVE)
// ==================================================================================

Background.craft = {
  displayName: "Background",
  props: {
    backgroundType: "color",
    backgroundColor: undefined,
    patternColor: undefined,
    patternOpacity: 0.1,
    patternSize: 20,
    amplitude: 1.0,
    blend: 0.5,
    auroraColorStops: ["#5227FF", "#7cff67", "#5227FF"],
    width: "100%",
    height: "100%",
  },
  rules: {
    canDrag: () => true,
    canMoveIn: () => true,
  },
  related: {
    settingsSchema: {
      groups: [
        {
          label: "Layout",
          fields: [
            {
              key: "width",
              type: "text",
              label: "Width",
            },
            {
              key: "height",
              type: "text",
              label: "Height",
            },
          ],
        },
        {
          label: "Background",
          fields: [
            {
              key: "backgroundType",
              type: "select",
              label: "BG Type",
              options: [
                { label: "Solid Color", value: "color" },
                ...Object.entries(FANCY_BACKGROUNDS).map(([id, def]) => ({
                  label: def.name,
                  value: id,
                })),
              ],
            },
            {
              key: "backgroundColor",
              type: "color",
              label: (props: BackgroundProps) =>
                props.backgroundType === "aurora"
                  ? "Base Color"
                  : "Background Color",
            },
            {
              key: "patternColor",
              type: "color",
              label: "Pattern Color",
              if: (props: BackgroundProps) =>
                props.backgroundType &&
                props.backgroundType !== "color" &&
                props.backgroundType !== "aurora",
            },
            {
              key: "patternOpacity",
              type: "number",
              label: "Pattern Opacity",
              min: 0,
              max: 1,
              step: 0.01,
              if: (props: BackgroundProps) =>
                props.backgroundType &&
                props.backgroundType !== "color" &&
                props.backgroundType !== "aurora",
            },
            {
              key: "patternSize",
              type: "number",
              label: "Pattern Size (px)",
              min: 1,
              step: 1,
              if: (props: BackgroundProps) =>
                props.backgroundType &&
                props.backgroundType !== "color" &&
                props.backgroundType !== "aurora",
            },
          ],
        },
        {
          label: "Aurora Settings",
          fields: [
            {
              key: "amplitude",
              type: "number",
              label: "Amplitude",
              if: (props: BackgroundProps) => props.backgroundType === "aurora",
            },
            {
              key: "blend",
              type: "number",
              label: "Blend",
              if: (props: BackgroundProps) => props.backgroundType === "aurora",
            },
            {
              key: "auroraColorStops",
              type: "array",
              label: "Color Stops",
              if: (props: BackgroundProps) => props.backgroundType === "aurora",
              item: {
                type: "color",
                label: "Color",
              },
            },
          ],
        },
      ],
    },
  },
};

export default Background;
