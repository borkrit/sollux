(() => {
  "use strict";

  const initializeFooter = () => {
    document.querySelectorAll("[data-footer-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        if (window.innerWidth >= 640) return;

        const list = button.nextElementSibling;
        const icon = button.querySelector("span");
        const isHidden = list.classList.contains("hidden");

        list.classList.toggle("hidden", !isHidden);
        list.classList.toggle("flex", isHidden);
        button.setAttribute("aria-expanded", String(isHidden));
        if (icon) icon.textContent = isHidden ? "−" : "+";
      });

      button.setAttribute("aria-expanded", "false");
    });
  };

  const initializeSlider = () => {
    const slider = document.querySelector("[data-slider]");
    if (!slider) return;

    const slides = [...slider.querySelectorAll("[data-slide]")];
    if (!slides.length) return;

    let activeIndex = 0;
    let timer;

    const progressList = slider.querySelector("[data-progress-list]");
    progressList.innerHTML = slides
      .map(
        (_, index) =>
          `<span class="slide-progress ${index === 0 ? "is-active" : ""}" aria-label="Slajd ${index + 1}">
            <span class="progress-fill ${index === 0 ? "is-running" : ""} block h-full rounded-full"></span>
          </span>`
      )
      .join("");

    const progressItems = [...progressList.querySelectorAll(".slide-progress")];

    const resetProgress = () => {
      progressItems.forEach((item, index) => {
        item.classList.remove("is-active", "is-complete");
        const fill = item.querySelector(".progress-fill");
        fill.classList.remove("is-running");
        void fill.offsetWidth;
        if (index < activeIndex) item.classList.add("is-complete");
      });

      const activeItem = progressItems[activeIndex];
      activeItem.classList.add("is-active");
      const activeFill = activeItem.querySelector(".progress-fill");
      void activeFill.offsetWidth;
      activeFill.classList.add("is-running");
    };

    const showSlide = (nextIndex) => {
      if (nextIndex === activeIndex) return;
      slides[activeIndex].classList.remove("is-active");
      activeIndex = (nextIndex + slides.length) % slides.length;
      slides[activeIndex].classList.add("is-active");
      resetProgress();
    };

    const startAutoplay = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => showSlide(activeIndex + 1), 3000);
      resetProgress();
    };

    slider.querySelector("[data-next]").addEventListener("click", () => {
      showSlide(activeIndex + 1);
      startAutoplay();
    });

    slider.querySelector("[data-prev]").addEventListener("click", () => {
      showSlide(activeIndex - 1);
      startAutoplay();
    });

    startAutoplay();

    const firstSlide = slides[0];
    const lamps = [...firstSlide.querySelectorAll("[data-lamp]")];
    const lampLightConfigs = {
      "1": {
        vector: "./assets/lampa-1-vector.svg",
        path: 'path[fill="#88664F"][d^="M297.047 777.52"]',
        fill: "url(#heroLamp1Glow)",
        filter:
          "drop-shadow(0 0 12px rgba(255, 206, 105, 0.95)) drop-shadow(0 0 28px rgba(255, 168, 54, 0.7))",
      },
      "2": {
        vector: "./assets/lampa-2-vector.svg",
        path: 'path[fill="#F5C7A5"][d^="M146.38 674.34"]',
        fill: "url(#heroLamp2Glow)",
        filter: "drop-shadow(0 0 28px rgba(255, 160, 75, 0.7))",
      },
      "3": {
        vector: "./assets/lampa-3-vector.svg",
        path: 'path[fill="#A26D55"][d^="M853.573 462.432"]',
        fill: "url(#heroLamp3Glow)",
        filter:
          "drop-shadow(0 0 12px rgba(255, 206, 145, 0.95)) drop-shadow(0 0 28px rgba(255, 160, 75, 0.7))",
      },
    };

    lamps.forEach((lamp) => {
      lamp.addEventListener("click", () => {
        const isLit = lamp.getAttribute("aria-pressed") === "true";
        lamp.setAttribute("aria-pressed", String(!isLit));
        const labels = {
          "1": "lampę górną",
          "2": "lampę zieloną",
          "3": "lampę czerwoną",
        };
        lamp.setAttribute(
          "aria-label",
          `${isLit ? "Włącz" : "Wyłącz"} ${labels[lamp.dataset.lampType]}`
        );
        lamp.classList.toggle("is-lit", !isLit);
      });

      const config = lampLightConfigs[lamp.dataset.lampType];
      if (!config) return;

      const loadLampLight = async () => {
        const response = await fetch(config.vector);
        if (!response.ok) {
          throw new Error(`Vector SVG request failed: ${response.status}`);
        }

        const svgText = await response.text();
        const vectorDocument = new DOMParser().parseFromString(svgText, "image/svg+xml");
        if (vectorDocument.querySelector("parsererror")) {
          throw new Error("Vector SVG could not be parsed.");
        }

        const diffuserPath = vectorDocument.querySelector(config.path);
        if (!diffuserPath) {
          throw new Error("The lamp diffuser path was not found in the vector SVG.");
        }

        const importedDiffuser = document.importNode(diffuserPath, true);
        importedDiffuser.setAttribute("class", "lamp-light");
        importedDiffuser.style.fill = config.fill;
        importedDiffuser.style.filter = config.filter;
        lamp.querySelector("svg").append(importedDiffuser);
      };

      loadLampLight().catch((error) => {
        console.error("Could not load the lamp's vector light path.", error);
        lamp.disabled = true;
        lamp.setAttribute("aria-label", "Lampa niedostępna: nie udało się wczytać konturu");
      });
    });

    firstSlide.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const rect = firstSlide.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      lamps.forEach((lamp) => {
        const depth = Number(lamp.dataset.depth || 1);
        lamp.style.transform = `translate3d(${x * 18 * depth}px, ${y * 12 * depth}px, 0)`;
      });
    });

    firstSlide.addEventListener("pointerleave", () => {
      lamps.forEach((lamp) => {
        lamp.style.transform = "translate3d(0, 0, 0)";
      });
    });
  };

  const initializeRayShader = () => {
    const canvas = document.querySelector("[data-rays-shader]");
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;

      const float TWO_PI = 6.28318530718;
      const float CYCLE_SECONDS = 22.0;

      float easeInOut(float t) {
        return t * t * (3.0 - 2.0 * t);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / max(u_resolution.xy, vec2(1.0));
        float phase = fract(u_time / CYCLE_SECONDS) * TWO_PI;
        float waveA = sin(phase);
        float waveB = cos(phase);
        float waveC = sin(phase * 2.0);
        float energyPulse = easeInOut(0.5 + 0.5 * sin(phase * 2.0 - 0.8));

        vec3 darkBg = vec3(0.032, 0.032, 0.028);
        vec3 deepGold = vec3(0.74, 0.50, 0.03);
        vec3 brightGold = vec3(0.99, 0.81, 0.20);

        float vMask = smoothstep(0.74, 0.0, uv.y);
        vMask = pow(vMask, 1.05);

        float leftCoord = (uv.x * 0.92 + uv.y * 0.76) - 0.34 + waveA * 0.095;
        float leftBeam = exp(-pow(leftCoord * 8.2, 2.0)) * smoothstep(0.62, 0.0, uv.y);
        float leftHalo = exp(-pow((leftCoord + 0.05) * 3.4, 2.0)) * smoothstep(0.55, 0.0, uv.y) * 0.72;

        float rightCoord = (uv.x - 0.48) * 0.95 + (uv.y - 0.12) * 0.72;
        float mainRay = smoothstep(-0.34, 0.14, rightCoord + waveB * 0.11) *
                        (1.0 - smoothstep(0.28, 0.72, rightCoord + waveA * 0.09));
        float secondRay = smoothstep(0.12, 0.42, rightCoord + waveC * 0.085) *
                          (1.0 - smoothstep(0.46, 0.78, rightCoord + waveB * 0.07));

        float shadowBand1 = 1.0 - 0.86 * exp(-pow((rightCoord - 0.08 - waveA * 0.085) * 9.5, 2.0));
        float shadowBand2 = 1.0 - 0.78 * exp(-pow((rightCoord - 0.40 - waveB * 0.075) * 10.5, 2.0));
        float rightIntensity = (mainRay * 1.15 + secondRay * 0.85) * shadowBand1 * shadowBand2 * vMask;

        float bottomGlow = smoothstep(0.32, 0.0, uv.y) * (0.48 + 0.28 * energyPulse);
        float totalLight = clamp(
          leftBeam * 1.15 + leftHalo * 0.75 + rightIntensity * (0.85 + 0.35 * energyPulse) + bottomGlow * 0.62,
          0.0,
          1.0
        );

        float goldRatio = clamp(leftBeam * 0.9 + mainRay * 0.8 + secondRay * 0.55 + bottomGlow * 0.5, 0.0, 1.0);
        vec3 lightColor = mix(deepGold, brightGold, goldRatio);
        vec3 finalColor = mix(darkBg, lightColor, totalLight);
        gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
      }
    `;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isInViewport = true;
    let rafId = null;
    const startTime = performance.now();

    const render = (now) => {
      if (!isInViewport) {
        rafId = null;
        return;
      }

      const elapsedSeconds = prefersReducedMotion ? 0 : (now - startTime) * 0.001;

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, elapsedSeconds);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!prefersReducedMotion) rafId = requestAnimationFrame(render);
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          isInViewport = entries[0]?.isIntersecting ?? true;
          if (isInViewport && rafId === null) rafId = requestAnimationFrame(render);
        },
        { threshold: 0.01 }
      );
      observer.observe(canvas);
    }

    rafId = requestAnimationFrame(render);
  };

  initializeFooter();
  initializeSlider();
  initializeRayShader();
})();
