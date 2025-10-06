# 🎶 @fizzwiz/ensemble

**A framework for live interactions — not just actions.**

`@fizzwiz/ensemble` introduces abstractions that go beyond traditional control flow, enabling you to **orchestrate asynchronous live performances** among event emitters with elegance and clarity.

Currently supported types:

- 🎺 **Player** — any event-aware component with a lifecycle (`play()`, `pause()`)
- 🎶 **Ensemble** — a live composition of coordinated Players
- 👥 **Secondo** - a player re-emitting as events event-like objects as mutations, intersections
- 🎹 **Solo** - a player performing some specific behavior through an internal ensemble of cues 

> Learn more at [ensemble-js.blogspot.com](https://ensemble-js.blogspot.com) — the concepts, patterns, and philosophy behind the design.

---

## 🛠️ Installation

### Node.js (ES Modules)

```bash
npm install @fizzwiz/ensemble
```

```js
import { Player, Ensemble,  MutationObserverSecondo, IntersectionObserverSecondo, ResizeObserverSecondo, Solo} from '@fizzwiz/ensemble';
```

### Browser (via CDN)

```html
<script src="https://cdn.jsdelivr.net/gh/fizzwiz/ensemble@latest/dist/ensemble.bundle.js"></script>
<script>
  const mySolo = new ensemble.Solo();
</script>
```

The global `ensemble` object exposes all core classes.

---

## 📘 Documentation

- 📗 **API Reference**: [fizzwiz.github.io/ensemble](https://fizzwiz.github.io/ensemble)  
  Dive into classes, methods, and usage patterns.

- 📘 **Concepts & Guides**: [ensemble-js.blogspot.com](https://ensemble-js.blogspot.com)  
  Explore the theory, design principles, and real-world use cases through guided narratives and tutorials.

---

> **"Let's blow async wide open."** 🎺  
> — `@fizzwiz ✨`
