import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../css/CityscapeContact.css';
import useThemeStore from '../../../store/useThemeStore';
import useLoadingStore from '../../../store/useLoadingStore';

// ─── Animation constants ─────────────────────────────────────────────────
// ┌─ TO MAKE BUILDINGS POP FASTER ────────────────────────────────────────┐
// │  JS (this file):                                                       │
// │    PHASE_GAP   — pause between each phase (platform/big/mid/small)    │
// │    BIG_STAGGER — delay between each big building                      │
// │    MID_STAGGER — delay between each medium building                   │
// │    SML_STAGGER — delay between each small building                    │
// │    t += 0.55   — platform expand wait (match CSS duration below)      │
// │                                                                        │
// │  CSS (CityscapeContact.css):                                           │
// │    cc-expand-platform — platform slide duration  (currently 0.55s)    │
// │    cc-pop-up          — per-building pop duration (currently 0.38s)   │
// └────────────────────────────────────────────────────────────────────────┘
const PHASE_GAP   = 0.12;  // ← lower = tighter gaps between phases
const BIG_STAGGER = 0.12;  // ← lower = big buildings appear closer together
const MID_STAGGER = 0.08;  // ← lower = medium buildings cascade faster
const SML_STAGGER = 0.06;  // ← lower = small buildings cascade faster

const BIG_IDS = ['b-radar','b-church','b-minaret','b-silo','b-apt-right'];
const MID_IDS = ['m-teal-office','m-green-step','m-dark-apt','m-office-grid','m-teal-win',
                 'm-stepped','m-block-rc','m-warehouse','m-pylons','m-bridge','m-dark-lc','m-townhall'];
const SML_IDS = ['s-pillar','s-left-h','s-brick-t','s-thin','s-teal-low','s-corner',
                 's-sheds','s-light','s-roof','s-cyan','s-teal-strip','s-hr-strip',
                 's-cyan-br','s-pale-apt','s-blue-bridge'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── CityscapeContact ──────────────────────────────────────────────────────
const CityscapeContact = () => {
  const [phase, setPhase]             = useState('idle');   // idle | animating | exiting | form
  const [formVisible, setFormVisible] = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [lit, setLit]                 = useState(false);   // windows-lit after submit
  const [form, setForm]               = useState({ name: '', email: '', message: '' });

  // ── Follow global theme from navbar store ──────────────────────────────
  const theme = useThemeStore((state) => state.theme);
  const isDay = theme === 'light';

  // ── Follow global loading state ──────────────────────────────────────────
  const isAppLoading = useLoadingStore((state) => state.isLoading);
  const hasStartedRef = useRef(false);

  const svgRef       = useRef(null);
  const stageRef     = useRef(null);
  const formRightRef = useRef(null);
  const timersRef    = useRef([]);

  // Clear all pending timers on unmount
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);



  const addTimer = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  // ── Reset SVG group classes ──────────────────────────────────────────────
  const resetAll = useCallback(() => {
    const all = ['g-platform', ...BIG_IDS, ...MID_IDS, ...SML_IDS, 'g-shadow'];
    all.forEach(id => {
      const el = svgRef.current?.querySelector(`#${id}`);
      if (!el) return;
      el.classList.remove('cc-animate');
      void el.offsetWidth; // force reflow
    });
  }, []);

  const scheduleAnimate = useCallback((id, delaySec) => {
    addTimer(() => {
      const el = svgRef.current?.querySelector(`#${id}`);
      if (el) el.classList.add('cc-animate');
    }, delaySec * 1000);
  }, []);

  // ── Trigger the full animation sequence ─────────────────────────────────
  const triggerBuild = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('animating');

    resetAll();
    let t = 0.1;

    scheduleAnimate('g-platform', t);
    t += 0.55 + PHASE_GAP;  // matches cc-expand-platform 0.55s duration

    shuffle(BIG_IDS).forEach((id, i) => scheduleAnimate(id, t + i * BIG_STAGGER));
    t += BIG_IDS.length * BIG_STAGGER + PHASE_GAP;

    shuffle(MID_IDS).forEach((id, i) => scheduleAnimate(id, t + i * MID_STAGGER));
    t += MID_IDS.length * MID_STAGGER + PHASE_GAP;

    shuffle(SML_IDS).forEach((id, i) => scheduleAnimate(id, t + i * SML_STAGGER));
    t += SML_IDS.length * SML_STAGGER + PHASE_GAP;

    scheduleAnimate('g-shadow', t);
    t += 0.6 + PHASE_GAP;

    // Morph into form
    addTimer(() => morphToForm(), t * 1000);
  }, [phase, resetAll, scheduleAnimate]);

  // ── Move SVG into the form right panel ──────────────────────────────────
  const morphToForm = useCallback(() => {
    // Step 1: fade out the fullscreen stage
    setPhase('exiting');

    addTimer(() => {
      const svg    = svgRef.current;
      const stage  = stageRef.current;
      const target = formRightRef.current;

      if (stage && target) {
        // Step 2a: teleport env-layer (sun + clouds) into the card
        const envLayer   = stage.querySelector('.cc-env-layer');
        const dayOverlay = stage.querySelector('.cc-day-overlay');
        if (envLayer)   target.appendChild(envLayer);
        if (dayOverlay) target.appendChild(dayOverlay);

        // Step 2b: teleport the SVG on top (z-index keeps buildings above sky)
        if (svg) {
          svg.classList.add('cc-svg--card');
          target.appendChild(svg);
        }
      }

      // Step 3: fully hide the now-empty stage wrap
      if (stage) stage.style.display = 'none';

      // Step 4: show the form
      setPhase('form');
      addTimer(() => setFormVisible(true), 60);
    }, 520);
  }, [addTimer, setPhase]);

  // ── Auto-start animation when loading finishes ──────────────────────────
  useEffect(() => {
    if (!isAppLoading && !hasStartedRef.current) {
      const checkAndRun = () => {
        if (svgRef.current) {
          hasStartedRef.current = true;
          triggerBuild();
        } else {
          const timeoutId = setTimeout(checkAndRun, 100);
          timersRef.current.push(timeoutId);
        }
      };
      
      const id = setTimeout(checkAndRun, 300);
      timersRef.current.push(id);
    }
  }, [isAppLoading, triggerBuild]);



  // ── Form submit ──────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLit(true);  // trigger window glow on the cityscape
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`cc-root ${isDay ? 'cc-day' : ''}`}>

      {/* ══ PHASE A: Fullscreen cityscape ══ */}
      <div
        ref={stageRef}
        className={`cc-stage-wrap ${phase === 'exiting' || phase === 'form' ? 'cc-stage-wrap--exit' : ''}`}
        aria-hidden={phase === 'form'}
      >
        {/* Environment */}
        <div className="cc-env-layer">
          <div className="cc-sun" />
          <div className="cc-sunbeam" />
          <div className="cc-cloud cc-cloud--1"><div className="cc-cloud-body" /></div>
          <div className="cc-cloud cc-cloud--2"><div className="cc-cloud-body" /></div>
          <div className="cc-cloud cc-cloud--3"><div className="cc-cloud-body" /></div>
        </div>
        <div className="cc-day-overlay" />

        {/* SVG Cityscape — no CTA button, auto-starts on mount */}
        <CityscapeSVG svgRef={svgRef} lit={lit} />
      </div>

      {/* ══ PHASE B: Two-column form ══ */}
      <div className="cc-form-wrap" aria-hidden={phase !== 'form'}>
        <div className={`cc-form-shell ${formVisible ? 'cc-form-shell--visible' : ''}`}>

          {/* Left: form fields */}
          <div className="cc-form-left">
            <h2 className="cc-form-title">
              Let's Build<br />
              <span className="cc-form-title-accent">&amp;</span> Launch
            </h2>
            <p className="cc-form-sub">· Tell us about your project ·</p>

            {!submitted ? (
              <form className="cc-build-form" onSubmit={handleSubmit}>
                <div className="cc-field-row">
                  <div className="cc-field">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div className="cc-field">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="cc-field">
                  <label>Message</label>
                  <textarea
                    placeholder="Describe what you want to build..."
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                </div>
                <button type="submit" className="cc-submit-btn">
                  <span className="cc-submit-text">Submit Brief</span>
                  <span className="cc-submit-arrow">→</span>
                </button>
              </form>
            ) : (
              <div className="cc-success">
                <span className="cc-success-icon">✓</span>
                <p className="cc-success-title">Brief received.</p>
                <p className="cc-success-sub">We'll be in touch soon.</p>
              </div>
            )}
          </div>

          {/* Right: live city card (SVG teleports here) */}
          <div className="cc-form-right" ref={formRightRef}>
            <span className="cc-preview-label">Live Preview</span>
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Cityscape SVG (all paths extracted from the HTML prototype) ───────────
const CityscapeSVG = ({ svgRef, lit }) => (
  <svg
    ref={svgRef}
    id="cc-city-svg"
    className={`cc-city-svg${lit ? ' cc-city-svg--lit' : ''}`}
    viewBox="0 0 1000 700"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Platform */}
    <g className="cc-platform-flat" id="g-platform">
      <path d="M933 403H83V452H933V403Z" fill="#1F302F"/>
      <path d="M958 423H42V455H958V423Z" fill="#2F3635"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M957.699 452.388V461.078H945.501V467.757H933.545V476.53H922.613L921.105 481.395H908.23V498.254H909.822V499.78H903.57V506.347H902.808V499.78H898.488V505.16H897.726V499.78H886.197L883.035 511.066H881.583V515.216H876.501V511.066H875.242V512.619H871.684V511.066H864.315V514.683H862.282V517.197H847.797V514.683H845.764V511.066H843.731V490.323H830.855V542.954H826.62V554.497H825.265V542.954H822.045V558.966H820.69V542.954H817.896V551.622H816.54V542.954H791.551V521.235H777.666V563.426L697.707 571.434L699.93 547.354C697.545 547.555 695.119 547.678 692.664 547.721L692.861 550.646C695.386 550.643 697.322 551.578 697.322 552.729C697.322 553.881 695.386 554.815 692.998 554.815C690.61 554.815 688.674 553.881 688.674 552.729C688.674 551.679 690.286 550.809 692.382 550.664L692.184 547.727C691.688 547.733 691.191 547.737 690.693 547.737C684.644 547.737 678.75 547.254 673.198 546.326L671.454 548.713C673.026 549.025 674.133 549.772 674.134 550.643C674.134 551.795 672.199 552.729 669.81 552.729C667.421 552.729 665.485 551.795 665.485 550.643C665.486 549.491 667.422 548.557 669.81 548.557C670.223 548.557 670.622 548.586 671 548.638L672.744 546.246C666.011 545.087 659.794 543.27 654.433 540.864L651.273 542.491C651.98 542.863 652.412 543.358 652.412 543.902C652.412 545.054 650.477 545.988 648.088 545.988C645.699 545.988 643.763 545.054 643.763 543.902C643.763 542.75 645.7 541.816 648.088 541.816C649.176 541.816 650.169 542.01 650.929 542.33L654.084 540.706C653.724 540.542 653.367 540.375 653.015 540.205C648.556 538.054 644.986 535.588 642.391 532.912L638.375 533.806C638.52 534.015 638.6 534.239 638.6 534.471C638.6 535.623 636.664 536.557 634.276 536.557C631.888 536.557 629.952 535.623 629.952 534.471C629.952 533.319 631.889 532.385 634.276 532.385C636.012 532.385 637.509 532.879 638.197 533.591L642.189 532.702C640.544 530.965 639.309 529.14 638.506 527.257H614.55V529.508H615.637V530.158H597.438V529.508H598.524V527.257H590.239V525.232H592.03V524.489H595.55V517.918H564.268V517.405H566.913V505.509H561.184L555.716 491.95V536.415H553.317V552.517H541.241V558.648H534.78V563.797H532.513V572.625H531.927V563.797H529.659V558.648H523.198V552.517H511.214V536.415H508.723V527.143L499.39 526.04V527.308H493.875V525.39L483.698 524.188V525.235H478.183V523.538L471.84 522.79V530.218H467.521V562.345H456.372V570.95H452.389V583.571H430.445V592.848H428.492V583.571H424.193V595.183H422.241V583.571H408.368V562.345H401.202V535.749H370.853V533.442H364.573V532.038H359.618V531.253H364.573V500.215H356.172V506.039H332.665V547.997H333.742V548.823H326.064V553.789H327.057V554.584H320.009V557.439H320.64V558.049H317.606V560.746H314.258V570.373H313.143V560.746H311.788V566.113H310.673V560.746H307.325V558.049H303.823V557.439H304.923V554.584H297.875V553.789H298.867V548.823H291.188V547.997H292.266V515.894H284.705V517.954H286.197V518.677H274.75V528.967H268.652V531.91H263.823V539.696H262.807V531.91H260.519V541.658H259.503V531.91H256.692V528.967H255.183V489.424H239.879V544.949H241.725V546.796H237.696V549.162H205.745V552.754H193.536L191.713 555.1H188.698V559.292H187.352V555.1H181.757V549.162H177.12V546.796H173.092V544.949H174.937V517.442H151.501V512.783H144.434V511.066H148.452V501.503H137.27V490.122H133.48V479.924H121.922V485.686H104.835V476.53H84.1748V474.411H64.3984V467.757H53.7012V461.516H42.1797V452.388H957.699Z" fill="black" fillOpacity="0.07"/>
    </g>

    {/* Big Buildings */}
    <g className="cc-big-bldg" id="b-radar" style={{transformOrigin:'664px 452px'}}>
      <path d="M727.33 321.111C725.064 321.111 723.207 322.854 723.022 325.072L717.958 324.907C717.971 324.411 717.979 323.914 717.979 323.416C717.979 317.113 716.891 310.977 714.806 305.222L719.037 303.664C719.702 305.198 721.228 306.271 723.006 306.271C725.394 306.271 727.33 304.335 727.33 301.947C727.33 299.559 725.394 297.623 723.006 297.623C720.618 297.623 718.682 299.559 718.682 301.947C718.682 302.388 718.748 302.813 718.871 303.214L714.641 304.771C712.231 298.306 708.556 292.332 703.741 287.157L707.052 284.055C707.828 284.797 708.879 285.253 710.038 285.253C712.426 285.253 714.362 283.317 714.362 280.929C714.362 278.541 712.426 276.605 710.038 276.605C707.65 276.605 705.714 278.541 705.714 280.929C705.714 281.986 706.094 282.954 706.724 283.706L703.413 286.809C703.072 286.449 702.726 286.092 702.373 285.74C697.36 280.727 691.524 276.836 685.17 274.193L686.991 269.759C687.404 269.89 687.844 269.961 688.3 269.961C690.688 269.961 692.624 268.025 692.624 265.637C692.624 263.249 690.688 261.313 688.3 261.313C685.912 261.313 683.976 263.249 683.976 265.637C683.976 267.399 685.03 268.914 686.542 269.588L684.725 274.012C679.04 271.708 672.948 270.397 666.666 270.17L666.863 264.109C669.388 264.112 671.324 262.176 671.324 259.788C671.324 257.4 669.388 255.464 667 255.464C664.612 255.464 662.676 257.4 662.676 259.788C662.676 261.967 664.288 263.768 666.384 264.068L666.186 270.155C665.69 270.141 665.193 270.134 664.695 270.134C658.646 270.134 652.752 271.136 647.2 273.059L645.456 268.112C647.029 267.465 648.136 265.918 648.136 264.112C648.136 261.724 646.2 259.788 643.812 259.788C641.424 259.788 639.487 261.724 639.487 264.112C639.487 266.5 641.423 268.436 643.812 268.436C644.225 268.436 644.624 268.377 645.002 268.269L646.746 273.217C640.013 275.619 633.796 279.384 628.435 284.371L625.275 280.999C625.982 280.229 626.414 279.203 626.414 278.075C626.414 275.687 624.478 273.751 622.09 273.751C619.702 273.751 617.765 275.687 617.765 278.075C617.765 280.463 619.701 282.399 622.09 282.399C623.178 282.399 624.171 281.996 624.931 281.333L628.086 284.7C627.017 285.739C622.558 290.198 618.988 295.308 616.393 300.855L612.374 299C612.599 295.234 610.663 293.298 608.275 293.298C605.887 293.298 603.951 295.234 603.951 297.622C603.951 300.01 605.887 301.946 608.275 301.946C610.011 301.946 611.508 300.922 612.196 299.446L616.188 301.289C613.322 307.563 611.698 314.383 611.443 321.445L606.288 321.277C604.315 317.073 601.967 317.073C599.579 317.073 597.643 319.009 597.643 321.397C597.643 323.785 599.579 325.721 601.967 325.721C604.234 325.721 606.092 323.976 606.275 321.757L611.428 321.925C611.407 322.918 611.407 323.416C611.407 329.719 612.495 335.855 614.58 341.61L610.349 343.168C608.158 340.561 606.38 340.561C603.992 340.561 602.056 342.497 602.056 344.885C602.056 347.273 603.992 349.209 606.38 349.209C608.768 349.209 610.705 347.273 610.705 344.885C610.705 344.444 610.639 344.019 610.516 343.618L614.746 342.06C617.156 348.525 620.831 354.499 625.646 359.674L622.335 362.776C620.508 361.578 619.349 361.578C616.961 361.578 615.025 363.514 615.025 365.902C615.025 368.29 616.961 370.226 619.349 370.226C621.737 370.226 623.674 368.29 623.674 365.902C623.674 364.845 623.294 363.877 622.664 363.125L625.975 360.023C627.014 361.092C630.39 364.468 634.14 367.335 638.17 369.655L612.095 417.716H607.415V419.09H605.123V421.819H724.26V419.09H721.968V417.716H717.288L691.213 369.655C694.687 367.655 697.952 365.249 700.95 362.461L705.175 366.97C703.694 370.227C703.694 372.615 705.63 374.551 708.018 374.551C710.406 374.551 712.343 372.615 712.343 370.227C712.343 367.839 710.407 365.903 708.018 365.903C707.102 365.903 706.254 366.188 705.555 366.674L701.3 362.133C702.369 361.094C706.828 356.635 710.398 351.525 712.994 345.978L717.7 348.15C717.569 349.209C717.569 351.597 719.505 353.533 721.893 353.533C724.281 353.533 726.217 351.597 726.217 349.209C726.217 346.821 724.281 344.885 721.893 344.885C720.04 344.885 718.46 346.05 717.845 347.688L713.197 345.542C716.063 339.268 717.687 332.448 717.942 325.386L723.008 325.551C724.98 329.758 727.329 329.758C729.717 329.758 731.654 327.822 731.654 325.434C731.654 323.046 729.718 321.111 727.33 321.111Z" fill="#3E4746"/>
    </g>
    <g className="cc-big-bldg" id="b-church" style={{transformOrigin:'203px 422px'}}>
      <path d="M234.604 176.316V184.753H238.633V191.346H236.787V422H171.845V191.346H170V184.753H174.028V176.316H234.604Z" fill="#786666"/>
      <path d="M185.944 148.391H188.961L190.786 153.816H203V176H179V148.391H184.598V138.697H185.944V148.391Z" fill="#786666"/>
      <path d="M185.271 136C185.939 136.001 186.479 136.605 186.479 137.349C186.479 138.093 185.939 138.696 185.271 138.696C184.603 138.696 184.061 138.093 184.061 137.349C184.061 136.605 184.602 136 185.271 136Z" fill="#786666"/>
      <path d="M203.633 197.087H201.633V206.087H203.633V197.087Z" fill="#CAC6C6"/><path d="M209.633 197.087H208.633V206.087H209.633V197.087Z" fill="#CAC6C6"/><path d="M217.633 197.087H214.633V206.087H217.633V197.087Z" fill="#CAC6C6"/><path d="M188.633 197.087H187.633V206.087H188.633V197.087Z" fill="#CAC6C6"/>
      <path d="M203.633 213.087H201.633V222.087H203.633V213.087Z" fill="#CAC6C6"/><path d="M209.633 213.087H208.633V222.087H209.633V213.087Z" fill="#CAC6C6"/><path d="M188.633 213.087H187.633V222.087H188.633V213.087Z" fill="#CAC6C6"/>
      <path d="M203.633 229.087H201.633V238.087H203.633V229.087Z" fill="#CAC6C6"/><path d="M209.633 229.087H208.633V238.087H209.633V229.087Z" fill="#CAC6C6"/><path d="M188.633 229.087H187.633V238.087H188.633V229.087Z" fill="#CAC6C6"/>
    </g>
    <g className="cc-big-bldg" id="b-minaret" style={{transformOrigin:'311px 413px'}}>
      <path d="M314.258 227.171H317.606V232.761H320.64V234.026H320.009V239.943H327.057V241.592H326.064V251.883H333.742V253.595H332.665V413.1H292.266V253.595H291.188V251.883H298.867V241.592H297.875V239.943H304.923V234.026H303.823V232.761H307.325V227.171H310.673V216.047H311.788V227.171H313.143V207.217H314.258V227.171Z" fill="#786666"/>
      <path d="M298.867 398.053H295.812V389.652H298.867V398.053Z" fill="#CFCACA"/><path d="M304.917 398.053H301.862V389.652H304.917V398.053Z" fill="#CFCACA"/><path d="M310.968 398.053H307.913V389.652H310.968V398.053Z" fill="#CFCACA"/><path d="M317.018 398.053H313.963V389.652H317.018V398.053Z" fill="#CFCACA"/>
      <path d="M302.632 250.59H301.368V243.509H302.632V250.59Z" fill="#CFCACA"/><path d="M309.63 250.59H308.365V243.509H309.63V250.59Z" fill="#CFCACA"/><path d="M316.626 250.59H315.361V243.509H316.626V250.59Z" fill="#CFCACA"/>
    </g>
    <g className="cc-big-bldg" id="b-silo" style={{transformOrigin:'846px 424px'}}>
      <path d="M865.855 265.046H826.551V423.892H865.855V265.046Z" fill="#6F7373"/>
      <path d="M857.045 231.861H855.69V275.027H857.045V231.861Z" fill="#6F7373"/><path d="M861.62 241.124H860.265V284.29H861.62V241.124Z" fill="#6F7373"/><path d="M852.895 247.083H851.54V290.249H852.895V247.083Z" fill="#6F7373"/>
    </g>
    <g className="cc-big-bldg" id="b-apt-right" style={{transformOrigin:'742px 313px'}}>
      <path d="M777.666 404.188H706.578L697.707 205.019L777.666 221.617V404.188Z" fill="#7F8989"/>
    </g>

    {/* Medium Buildings */}
    <g className="cc-mid-bldg" id="m-teal-office" style={{transformOrigin:'396px 352px'}}>
      <path d="M428.494 283.762H364.573V422.892H428.494V283.762Z" fill="#3A4847"/>
      <path d="M422.214 278.98H370.853V302.153H422.214V278.98Z" fill="#3A4847"/>
      <path d="M433.449 286.673H359.618V288.3H433.449V286.673Z" fill="#95A9A7"/>
    </g>
    <g className="cc-mid-bldg" id="m-green-step" style={{transformOrigin:'584px 366px'}}>
      <path d="M622.722 315.937V317H620.077V415.841H584.14V416.97H546.529L561.184 341.655H566.913V317H564.268V315.937H622.722Z" fill="#3A6762"/>
    </g>
    <g className="cc-mid-bldg" id="m-dark-apt" style={{transformOrigin:'497px 370px'}}>
      <path d="M553.317 277.6V244.226H541.241V231.52H534.78V220.846H532.513V202.55H531.927V220.846H529.659V231.52H523.198V244.226H511.214V277.6H508.723V338.192H490.142V407.264H508.723H527.305H555.716V277.6H553.317Z" fill="#829290"/>
    </g>
    <g className="cc-mid-bldg" id="m-office-grid" style={{transformOrigin:'618px 375px'}}>
      <path d="M642.669 299.878H595.55V451.757H642.669V299.878Z" fill="#658280"/>
      <path d="M646.19 300.778H592.03V302.317H646.19V300.778Z" fill="#658280"/>
      <path d="M644.724 322.112H593.495V323.646H644.724V322.112Z" fill="#658280"/><path d="M644.724 342.773H593.495V344.307H644.724V342.773Z" fill="#658280"/><path d="M644.724 363.434H593.495V364.968H644.724V363.434Z" fill="#658280"/>
      <path d="M604.687 307.306H599.791V319.439H604.687V307.306Z" fill="#658280"/><path d="M615.638 307.306H610.742V319.439H615.638V307.306Z" fill="#658280"/><path d="M626.589 307.306H621.693V319.439H626.589V307.306Z" fill="#658280"/><path d="M637.539 307.306H632.643V319.439H637.539V307.306Z" fill="#658280"/>
      <path d="M614.55 290.792H598.524V298.68H614.55V290.792Z" fill="#658280"/>
    </g>
    <g className="cc-mid-bldg" id="m-teal-win" style={{transformOrigin:'691px 403px'}}>
      <path d="M656.076 451.757H724.943V359.002H656.076V451.757Z" fill="#70AEAA"/>
      <path d="M654.297 359.003H728.961V355.445H654.297V359.003Z" fill="#70AEAA"/>
      <path d="M691.628 364.593H721.893V345.788H691.628V364.593Z" fill="#70AEAA"/>
    </g>
    <g className="cc-mid-bldg" id="m-stepped" style={{transformOrigin:'496px 370px'}}>
      <path d="M530.773 289.249V451.757H462.491V304.911H468.006V306.776L478.183 304.286V300.773H483.698V302.937L493.875 300.448V296.475H499.39V299.099L509.566 296.609V292.973H515.081V295.261L525.258 292.771V289.249H530.773Z" fill="#324E4C"/>
      <path d="M476.754 444.898H469.434V433.746H476.754V444.898Z" fill="#324E4C"/><path d="M492.446 444.898H485.126V433.746H492.446V444.898Z" fill="#324E4C"/><path d="M508.138 444.898H500.818V433.746H508.138V444.898Z" fill="#324E4C"/>
    </g>
    <g className="cc-mid-bldg" id="m-block-rc" style={{transformOrigin:'799px 390px'}}>
      <path d="M819.335 341.475H763.767V422.893H819.335V341.475Z" fill="#2A413F"/>
    </g>
    <g className="cc-mid-bldg" id="m-warehouse" style={{transformOrigin:'880px 400px'}}>
      <path d="M895.369 444.46H843.528V351.706H882.832L895.369 444.46Z" fill="#56807B"/>
      <path d="M864.112 344.209H845.561V358.821H864.112V344.209Z" fill="#56807B"/><path d="M862.079 339H847.594V347.213H862.079V339Z" fill="#56807B"/>
    </g>
    <g className="cc-mid-bldg" id="m-pylons" style={{transformOrigin:'891px 400px'}}>
      <path d="M908.23 355.296H873.463V451.757H908.23V355.296Z" fill="#A0BCBA"/>
      <path d="M909.822 353.53H871.684V356.692H909.822V353.53Z" fill="#658280"/>
    </g>
    <g className="cc-mid-bldg" id="m-bridge" style={{transformOrigin:'800px 385px'}}>
      <path d="M772.285 451.757H826.798V316.293H772.285V451.757Z" fill="#929292"/>
      <path d="M774.117 327.261H824.966V309.062H774.117V327.261Z" fill="#658280"/>
      <path d="M800.938 321.501H821.073V301.617H800.938V321.501Z" fill="#658280"/>
    </g>
    <g className="cc-mid-bldg" id="m-dark-lc" style={{transformOrigin:'330px 377px'}}>
      <path d="M356.172 340.557H304.346V422.893H356.172V340.557Z" fill="#59918B"/>
    </g>
    <g className="cc-mid-bldg" id="m-townhall" style={{transformOrigin:'183px 377px'}}>
      <path d="M217.319 330.138H148.452V422.893H217.319V330.138Z" fill="#2D403E"/>
      <path d="M181.766 316.923H151.501V335.728H181.766V316.923Z" fill="#2D403E"/>
    </g>

    {/* Small Buildings */}
    <g className="cc-small-bldg" id="s-pillar" style={{transformOrigin:'285px 383px'}}>
      <path d="M286.197 314.364V315.862H284.705V320.132H310.968V451.757H267.87V314.364H286.197Z" fill="#3F4E4D"/>
    </g>
    <g className="cc-small-bldg" id="s-left-h" style={{transformOrigin:'137px 400px'}}>
      <path d="M155 320.405H118.595V430H155V320.405Z" fill="#7F8383"/>
      <path d="M122.082 274H104.843V429.996H122.082V274Z" fill="#7F8383"/>
      <path d="M113.463 375.203H84V430H113.463V375.203Z" fill="#7F8383"/>
    </g>
    <g className="cc-small-bldg" id="s-brick-t" style={{transformOrigin:'154px 387px'}}>
      <path d="M171.831 349.959H137.27V422.892H171.831V349.959Z" fill="#4C3C3C"/>
    </g>
    <g className="cc-small-bldg" id="s-thin" style={{transformOrigin:'270px 370px'}}>
      <path d="M275 299.851H255V423H275V299.851Z" fill="#9CB2B0"/>
      <path d="M268.767 292.233H256.542V308.737H268.767V292.233Z" fill="#9CB2B0"/>
    </g>
    <g className="cc-small-bldg" id="s-teal-low" style={{transformOrigin:'320px 394px'}}>
      <path d="M327 365H293V423H327V365Z" fill="#1F9F96"/>
      <path d="M363 355H343V423H363V355Z" fill="#24B1A3"/>
      <path d="M260 355H225V423H260V355Z" fill="#399A94"/>
    </g>
    <g className="cc-small-bldg" id="s-corner" style={{transformOrigin:'210px 404px'}}>
      <path d="M228.729 356.362H198.721V451.757H228.729V356.362Z" fill="#658280"/>
      <path d="M163.303 373.549H133.48V451.757H163.303V373.549Z" fill="#658280"/>
      <path d="M209.517 422.892H163.303V451.757H209.517V422.892Z" fill="#658280"/>
    </g>
    <g className="cc-small-bldg" id="s-sheds" style={{transformOrigin:'861px 420px'}}>
      <path d="M843.731 395.834H819.335V451.757H843.731V395.834Z" fill="#7AD0CA"/>
    </g>
    <g className="cc-small-bldg" id="s-light" style={{transformOrigin:'270px 430px'}}>
      <path d="M255.486 376.238H222.785V451.757H255.486V376.238Z" fill="#CBD0D0"/>
      <path d="M288.637 408.629H251.974V451.757H288.637V408.629Z" fill="#CBD0D0"/>
      <path d="M146.834 412.523H107.6V451.757H146.834V412.523Z" fill="#CBD0D0"/>
    </g>
    <g className="cc-small-bldg" id="s-roof" style={{transformOrigin:'440px 430px'}}>
      <path d="M462 451H417V410H462V451Z" fill="#70BFBA"/>
      <path d="M584.139 451.757H523.83V426.121H538.227V382.184H584.139V451.757Z" fill="#70BFBA"/>
    </g>
    <g className="cc-small-bldg" id="s-cyan" style={{transformOrigin:'760px 420px'}}>
      <path d="M777.666 368.569H749.844V451.757H777.666V368.569Z" fill="#7CE8E0"/>
      <path d="M763.767 451.757H724.576V407.264L757.654 421.92L763.767 451.757Z" fill="#7CE8E0"/>
    </g>
    <g className="cc-small-bldg" id="s-teal-strip" style={{transformOrigin:'651px 447px'}}>
      <path d="M615.638 442.581H581.598V451.757H615.638V442.581Z" fill="#6EDAD3"/>
      <path d="M689.371 426.121H634.027V451.757H689.371V426.121Z" fill="#6EDAD3"/>
    </g>
    <g className="cc-small-bldg" id="s-hr-strip" style={{transformOrigin:'865px 440px'}}>
      <path d="M895.572 427.593H835.72V451.757H895.572V427.593Z" fill="#69F0E7"/>
    </g>
    <g className="cc-small-bldg" id="s-cyan-br" style={{transformOrigin:'932px 430px'}}>
      <path d="M924.93 392L931 437.13V437H958V452H906V392H924.93Z" fill="#A7FEF8"/>
    </g>
    <g className="cc-small-bldg" id="s-pale-apt" style={{transformOrigin:'76px 428px'}}>
      <path d="M88.9391 406.111H64.3981V451.757H88.9391V406.111Z" fill="#B1B1B1"/>
      <path d="M71.9081 432.838H42.1801V451.757H71.9081V432.838Z" fill="#CBD0D0"/>
    </g>
    <g className="cc-small-bldg" id="s-blue-bridge" style={{transformOrigin:'113px 444px'}}>
      <path d="M142.178 437.459H84.1751V451.757H142.178V437.459Z" fill="#B5F6F2"/>
    </g>

    {/* Shadow */}
    <g className="cc-shadow-group" id="g-shadow">
      <rect x="42" y="452" width="916" height="10" fill="rgba(0,0,0,0.15)"/>
    </g>

    {/* ── Window glow overlay — lights up on submit ── */}
    {/* Each rect sits over a building face. opacity driven by cc-city-svg--lit class */}
    <g id="cc-windows-overlay" className="cc-windows-overlay">

      {/* Church tower windows — left side */}
      <rect className="cc-win cc-win--d0" x="188" y="195" width="7"  height="10" rx="1"/>
      <rect className="cc-win cc-win--d1" x="196" y="195" width="7"  height="10" rx="1"/>
      <rect className="cc-win cc-win--d2" x="202" y="195" width="7"  height="10" rx="1"/>
      <rect className="cc-win cc-win--d1" x="188" y="212" width="7"  height="10" rx="1"/>
      <rect className="cc-win cc-win--d3" x="202" y="212" width="7"  height="10" rx="1"/>
      <rect className="cc-win cc-win--d2" x="188" y="228" width="7"  height="10" rx="1"/>
      <rect className="cc-win cc-win--d4" x="202" y="228" width="7"  height="10" rx="1"/>

      {/* Minaret tower — center-left */}
      <rect className="cc-win cc-win--d2" x="296" y="340" width="5" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d3" x="304" y="340" width="5" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d1" x="312" y="340" width="5" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d4" x="320" y="340" width="5" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d0" x="296" y="360" width="5" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d2" x="312" y="360" width="5" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d5" x="296" y="380" width="5" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d3" x="312" y="380" width="5" height="8"  rx="1"/>

      {/* Teal office block */}
      <rect className="cc-win cc-win--d3" x="370" y="295" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d5" x="382" y="295" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d1" x="394" y="295" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d4" x="406" y="295" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d2" x="370" y="315" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d0" x="394" y="315" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d6" x="370" y="335" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d3" x="382" y="335" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d5" x="406" y="335" width="8" height="10" rx="1"/>

      {/* Stepped dark apartment center */}
      <rect className="cc-win cc-win--d4" x="470" y="310" width="7" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d2" x="480" y="310" width="7" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d6" x="490" y="310" width="7" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d1" x="500" y="310" width="7" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d3" x="510" y="310" width="7" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d5" x="470" y="328" width="7" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d0" x="490" y="328" width="7" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d4" x="510" y="328" width="7" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d2" x="470" y="346" width="7" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d6" x="490" y="346" width="7" height="9"  rx="1"/>

      {/* Office grid building */}
      <rect className="cc-win cc-win--d1" x="600" y="310" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d3" x="610" y="310" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d5" x="622" y="310" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d0" x="634" y="310" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d4" x="600" y="328" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d2" x="622" y="328" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d6" x="634" y="328" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d1" x="600" y="346" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d3" x="610" y="346" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d5" x="622" y="346" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d0" x="600" y="364" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d4" x="622" y="364" width="6" height="9"  rx="1"/>
      <rect className="cc-win cc-win--d2" x="634" y="364" width="6" height="9"  rx="1"/>

      {/* Teal tall windows building */}
      <rect className="cc-win cc-win--d3" x="660" y="370" width="9" height="12" rx="1"/>
      <rect className="cc-win cc-win--d5" x="674" y="370" width="9" height="12" rx="1"/>
      <rect className="cc-win cc-win--d1" x="688" y="370" width="9" height="12" rx="1"/>
      <rect className="cc-win cc-win--d4" x="702" y="370" width="9" height="12" rx="1"/>
      <rect className="cc-win cc-win--d0" x="716" y="370" width="9" height="12" rx="1"/>
      <rect className="cc-win cc-win--d6" x="660" y="392" width="9" height="12" rx="1"/>
      <rect className="cc-win cc-win--d2" x="688" y="392" width="9" height="12" rx="1"/>
      <rect className="cc-win cc-win--d5" x="716" y="392" width="9" height="12" rx="1"/>
      <rect className="cc-win cc-win--d1" x="660" y="414" width="9" height="12" rx="1"/>
      <rect className="cc-win cc-win--d3" x="674" y="414" width="9" height="12" rx="1"/>
      <rect className="cc-win cc-win--d4" x="702" y="414" width="9" height="12" rx="1"/>

      {/* Right apartment tower */}
      <rect className="cc-win cc-win--d2" x="712" y="230" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d4" x="724" y="230" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d6" x="736" y="230" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d1" x="748" y="230" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d0" x="712" y="250" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d5" x="736" y="250" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d3" x="748" y="250" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d4" x="712" y="270" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d2" x="724" y="270" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d6" x="748" y="270" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d1" x="712" y="290" width="8" height="10" rx="1"/>
      <rect className="cc-win cc-win--d5" x="736" y="290" width="8" height="10" rx="1"/>

      {/* Silo / tower right */}
      <rect className="cc-win cc-win--d3" x="831" y="280" width="6" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d5" x="841" y="280" width="6" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d1" x="851" y="280" width="6" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d4" x="831" y="298" width="6" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d0" x="851" y="298" width="6" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d6" x="831" y="316" width="6" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d2" x="841" y="316" width="6" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d5" x="851" y="316" width="6" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d3" x="831" y="334" width="6" height="8"  rx="1"/>
      <rect className="cc-win cc-win--d1" x="851" y="334" width="6" height="8"  rx="1"/>

    </g>
  </svg>
);

export default CityscapeContact;