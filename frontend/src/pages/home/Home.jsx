// Landing page component that provides navigation to different user dashboards and application overview
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  // ✅ SMOOTH SCROLL FUNCTION
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className={styles.home}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.logo}>TaskPro</div>

        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            <li onClick={() => scrollToSection('solutions')}>Solutions</li>
            <li onClick={() => scrollToSection('methodology')}>Methodology</li>
            <li onClick={() => scrollToSection('pricing')}>Pricing</li>
            <li onClick={() => scrollToSection('enterprise')}>Enterprise</li>
          </ul>
          <div className={styles.navActions}>
            <button
              className={styles.navLogin}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className={styles.navCta}
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className={styles.hero}>
        <span className={styles.heroBadge}>Introducing TaskPro 2.0</span>
        <h1 className={styles.heroTitle}>
          The Architectural Standard<br />for Team Velocity.
        </h1>
        <p className={styles.heroDesc}>
          A disciplined workspace for managers to create, track, and master
          project lifecycles. Designed for high-performance teams who demand
          editorial precision.
        </p>
        <div className={styles.heroButtons}>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate("/register")}
          >
            Sign Up Now
          </button>
          <button
            className={styles.btnSecondary}
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="solutions" className={styles.features}>
        <h2 className={styles.sectionLabel}>Curated for Scale</h2>
        <p className={styles.sectionSub}>
          Every pixel is engineered to reduce cognitive load and maximise team output.
        </p>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✦</div>
            <div className={styles.featureTitle}>Production Ready</div>
            <p className={styles.featureDesc}>
              Built for real-world enterprise demand with bank-grade security
              and 99.9% uptime guaranteed. No beta tags, just performance.
            </p>
            <span className={styles.featureLink}>Learn more →</span>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>▦</div>
            <div className={styles.featureTitle}>Data-Driven Insights</div>
            <p className={styles.featureDesc}>
              Real-time monitoring for managers and admins. Visualise
              bottlenecks before they impact your sprint goals.
            </p>
            <span className={styles.featureLink}>Explore analytics →</span>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⬡</div>
            <div className={styles.featureTitle}>Collaborative Ensemble</div>
            <p className={styles.featureDesc}>
              Seamless task assignment and commenting. Bring your team
              together in a workspace that feels like an architectural studio.
            </p>
            <span className={styles.featureLink}>View collaboration →</span>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ─────────────────────────────────────── */}
      <section id="methodology" className={styles.philosophy}>
        <div className={styles.philoLeft}>
          <p className={styles.philoEyebrow}>Design Philosophy</p>
          <h2 className={styles.philoTitle}>
            The End of<br /><em>Digital Clutter.</em>
          </h2>
          <div className={styles.philoList}>
            <div className={styles.philoItem}>
              <span className={styles.philoNum}>01</span>
              <div className={styles.philoItemContent}>
                <div className={styles.philoItemTitle}>Intentional Asymmetry</div>
                <p className={styles.philoItemDesc}>
                  We prioritise focus over rigid grids, leading the eye to
                  what truly matters.
                </p>
              </div>
            </div>
            <div className={styles.philoItem}>
              <span className={styles.philoNum}>02</span>
              <div className={styles.philoItemContent}>
                <div className={styles.philoItemTitle}>Tonal Depth</div>
                <p className={styles.philoItemDesc}>
                  Layers and surface shifts replace harsh borders for a
                  breathable workspace.
                </p>
              </div>
            </div>
            <div className={styles.philoItem}>
              <span className={styles.philoNum}>03</span>
              <div className={styles.philoItemContent}>
                <div className={styles.philoItemTitle}>Editorial Typography</div>
                <p className={styles.philoItemDesc}>
                  Data is treated with the prestige of a high-end publication.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mock UI Panel */}
        <div className={styles.philoRight}>
          <div className={styles.mockPanel}>
            <div className={styles.mockCard}>
              <div className={styles.mockCardTop}>
                <span className={styles.mockCardTitle}>Project Velocity</span>
                <div className={styles.mockCardDots}>
                  <span /><span /><span />
                </div>
              </div>
              <div className={styles.mockProgress}>
                <div className={styles.mockProgressFill} />
              </div>
              <div className={styles.mockMeta}>
                <span className={styles.mockSprint}>Architecture Sprint</span>
                <span className={styles.mockPct}>85% Complete</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section id="pricing" className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          Ready to Master Your<br />Workflow?
        </h2>
        <p className={styles.ctaDesc}>
          Join over 10,000 managers who have moved to a more disciplined
          way of project management.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaBtnPrimary}
            onClick={() => navigate("/register")}
          >
            Get Started Free
          </button>
          <button className={styles.ctaBtnSecondary}>
            Talk to Sales
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer id="enterprise" className={styles.footer}>
        <div>
          <div className={styles.footerBrand}>TaskPro</div>
          <p className={styles.footerCopy}>
            © 2024 TaskPro Interface. Curated Enterprise Management.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <span onClick={() => navigate('/')} className={styles.footerLink}>Home</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Security</span>
        </div>
        <div className={styles.footerActions}>
          <button className={styles.footerIconBtn}>⊕</button>
          <button className={styles.footerIconBtn}>⇧</button>
        </div>
      </footer>

    </div>
  );
};

export default Home;
