import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { loginController } from "./controllers/auth.controller.js";


dotenv.config();

const app = express();
console.log('=== APP INITIALIZED - VERSION 2 ===');

// Middlewares
app.use((req, res, next) => {
  console.log(`>>> ${req.method} ${req.path}`);
  next();
});
app.use(cors());
app.use(express.json());

// Auth routes
console.log('authRoutes imported ->', typeof authRoutes, Object.keys(authRoutes || {}));
try {
  app.use("/api/auth", authRoutes);
  console.log('Router mounted successfully');
} catch (e) {
  console.error('Failed to mount router:', e);
}

// User routes
app.use("/api/users", userRoutes);

// Direct mount for login (fallback if router mounting has issues)
app.post('/api/auth/login', (req, res, next) => {
  console.log('=== LOGIN ROUTE HIT ===', req.body);
  next();
}, loginController);

// Debug: list registered routes
try {
  const routes = (app as any)._router?.stack?.filter((r: any) => r.route).map((r: any) => ({ path: r.route.path, methods: r.route.methods }));
  console.log('registered routes ->', routes);
} catch (e) {
  console.log('failed to list routes', e);
}

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Practo CMS Backend Running" });
});

// Test route
app.post('/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ success: true, message: 'Test works' });
});

// Debug endpoint to list registered routes
app.get('/__routes', (req, res) => {
  try {
    const routes = (app as any)._router?.stack?.filter((r: any) => r.route).map((r: any) => ({ path: r.route.path, methods: r.route.methods })) || [];
    res.json({ routes });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global error handler:', err);
  res.status(500).json({ success: false, message: 'Server error', error: err.message });
});

export default app;
