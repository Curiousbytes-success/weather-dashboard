"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float u_time;
  varying vec3 vNormal;
  varying float vDisplacement;

  void main(){
    vNormal = normalize(normalMatrix * normal);

    float d = sin(position.x * 3.0 + u_time * 0.6)
            + sin(position.y * 3.0 + u_time * 0.5)
            + sin(position.z * 3.0 + u_time * 0.7);
    d = d / 3.0;
    vDisplacement = d;

    vec3 newPosition = position + normal * d * 0.22;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform vec3 u_amber;
  uniform vec3 u_violet;
  varying vec3 vNormal;
  varying float vDisplacement;

  void main(){
    vec3 lightDir = normalize(vec3(0.4, 0.6, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);

    vec3 base = mix(u_violet, u_amber, smoothstep(-0.3, 0.3, vDisplacement));
    vec3 color = base * (0.35 + diff * 0.85);

    float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
    color += u_amber * fresnel * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function useTypedText(phrase: string, delayMs = 500, speedMs = 110) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const start = setTimeout(function loop() {
      if (i <= phrase.length) {
        setTyped(phrase.slice(0, i));
        i++;
        timeout = setTimeout(loop, speedMs);
      }
    }, delayMs);
    return () => {
      clearTimeout(start);
      clearTimeout(timeout);
    };
  }, [phrase, delayMs, speedMs]);

  return typed;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typed = useTypedText("whoami");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.2;

    const uniforms = {
      u_time: { value: 0 },
      u_amber: { value: new THREE.Vector3(0.91, 0.702, 0.298) },
      u_violet: { value: new THREE.Vector3(0.424, 0.482, 1.0) },
    };

    // Lower subdivision on small screens to keep frame rate solid on mobile
    const isSmall = window.innerWidth < 640;
    const geometry = new THREE.IcosahedronGeometry(1.5, isSmall ? 3 : 5);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function resize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    const targetRotation = { x: 0, y: 0 };
    function onMouseMove(e: MouseEvent) {
      targetRotation.y = (e.clientX / window.innerWidth - 0.5) * 0.8;
      targetRotation.x = (e.clientY / window.innerHeight - 0.5) * 0.5;
    }
    window.addEventListener("mousemove", onMouseMove);

    const clock = new THREE.Clock();
    let frameId: number;
    function animate() {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!prefersReduced) {
        uniforms.u_time.value = t;
        mesh.rotation.y += 0.0025;
        mesh.rotation.x += 0.0008;
      }

      mesh.rotation.y += (targetRotation.y - mesh.rotation.y) * 0.02;
      mesh.rotation.x += (targetRotation.x - mesh.rotation.x) * 0.02;

      renderer.render(scene, camera);
    }
    animate();

    // Cleanup: dispose GPU resources and listeners on unmount
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <header className="hero" id="home">
      <canvas ref={canvasRef} id="hero-canvas" />
      <div className="wrap hero-content">
        <div className="terminal">
          <span>sunidhi@portfolio:~$</span>
          <span>{typed}</span>
          <span className="cursor" />
        </div>
        <h1>
          I build things that work
          <br />— <span className="accent">end to end.</span>
        </h1>
        <p className="lead">
          BCA graduate from Damoh, Madhya Pradesh, building full-stack web
          applications with PHP, MySQL and JavaScript. Currently interning,
          always shipping something new.
        </p>
        <div className="hero-actions">
          <Link href="/work" className="btn btn-primary">
            View work →
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Get in touch
          </Link>
        </div>
      </div>
      <div className="scroll-hint">
        <span className="line" /> scroll
      </div>
    </header>
  );
}
