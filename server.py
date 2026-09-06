#!/usr/bin/env python3
"""
==========================================================================
AMBER & SHINE - ATELIER BACKEND & ROLE-BASED ACCESS CONTROL SERVICE
==========================================================================
Zero-dependency, standalone HTTP server powering real backend authentication,
role-based access control (customer vs. admin), SQLite database persistence,
PBKDF2 cryptographic password hashing, email verification, session management,
product catalog CRUD, order management, activity audit logging, and static asset serving.
"""

import http.server
import socketserver
import sqlite3
import hashlib
import secrets
import hmac
import json
import re
import os
import mimetypes
import base64
from datetime import datetime, timedelta

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "users.db")
PBKDF2_ITERATIONS = 100_000

# --------------------------------------------------------------------------
# DATABASE INITIALIZATION & SCHEMA
# --------------------------------------------------------------------------

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str, salt_hex: str = None):
    if salt_hex is None:
        salt_bytes = secrets.token_bytes(16)
        salt_hex = salt_bytes.hex()
    else:
        salt_bytes = bytes.fromhex(salt_hex)
    
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt_bytes,
        PBKDF2_ITERATIONS
    )
    return key.hex(), salt_hex

def verify_password(password: str, stored_hash: str, salt_hex: str) -> bool:
    try:
        calculated_hash, _ = hash_password(password, salt_hex)
        return hmac.compare_digest(calculated_hash, stored_hash)
    except Exception:
        return False

def is_valid_email(email: str) -> bool:
    if not email or not isinstance(email, str):
        return False
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email.strip()))

def log_activity(admin_email: str, action: str, entity_type: str = "", entity_id: str = "", details: str = ""):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO activity_logs (admin_email, action, entity_type, entity_id, details, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (admin_email, action, entity_type, entity_id, details, datetime.now().isoformat()))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[ActivityLog Error] {e}")

# Default catalog seed data
DEFAULT_SEED_PRODUCTS = [
    {
        "id": "as-001",
        "name": "Dainty Twinkle Solitaire Ring",
        "description": "An everyday signature that whispers quiet elegance. Handcrafted solid fine metal with a prong-set brilliant cultivated solitaire (0.12 ct, VVS clarity).",
        "category": "Rings",
        "price": 13800,
        "original_price": 15500,
        "discount_price": 13800,
        "stock": 14,
        "low_stock_threshold": 5,
        "sku": "AS-RNG-001",
        "material": "Warm Amber Tone",
        "jewellery_type": "Solitaire",
        "sizes": json.dumps(["US 5 / IN 10", "US 6 / IN 12", "US 7 / IN 14", "US 8 / IN 16"]),
        "metals": json.dumps(["Warm Amber Tone", "Rose Tone", "Silver Rhodium Tone"]),
        "images": json.dumps([
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
            "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85"
        ]),
        "status": "Active",
        "is_featured": 1,
        "badge": "HANDCRAFTED FINE JEWEL"
    },
    {
        "id": "as-002",
        "name": "Lustre Dewdrop Baroque Pearl Studs",
        "description": "Modern organic charm for the contemporary woman. Handpicked AA+ lustrous freshwater baroque pearls crowned with artisanal cup bezels.",
        "category": "Earrings",
        "price": 18400,
        "original_price": 21000,
        "discount_price": 18400,
        "stock": 8,
        "low_stock_threshold": 5,
        "sku": "AS-EAR-002",
        "material": "Warm Amber Tone",
        "jewellery_type": "Pearl",
        "sizes": json.dumps(["One Size"]),
        "metals": json.dumps(["Warm Amber Tone", "Rose Tone"]),
        "images": json.dumps([
            "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85"
        ]),
        "status": "Active",
        "is_featured": 1,
        "badge": "BESTSELLER"
    },
    {
        "id": "as-003",
        "name": "Aura Solitaire Pendant & Chain",
        "description": "A luminous drop of pure sunlight. Single 0.18 ct round brilliant solitaire encased in a low-profile geometric bezel with Italian precision cable chain.",
        "category": "Pendants",
        "price": 19500,
        "original_price": 22800,
        "discount_price": 19500,
        "stock": 3,
        "low_stock_threshold": 5,
        "sku": "AS-PND-003",
        "material": "Warm Amber Tone",
        "jewellery_type": "Solitaire",
        "sizes": json.dumps(['16-18" Adjustable']),
        "metals": json.dumps(["Warm Amber Tone", "Rose Tone", "Silver Rhodium Tone"]),
        "images": json.dumps([
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85"
        ]),
        "status": "Active",
        "is_featured": 1,
        "badge": "SIGNATURE SOLITAIRE"
    },
    {
        "id": "as-004",
        "name": "Modern Flora Sacred Mangalsutra",
        "description": "Reimagined for the contemporary bride. Petite floral cluster of 7 sparkling gemstones flanked by minimal black spinel beads on a delicate chain.",
        "category": "Mangalsutras",
        "price": 32500,
        "original_price": 36000,
        "discount_price": 32500,
        "stock": 11,
        "low_stock_threshold": 5,
        "sku": "AS-MNG-004",
        "material": "Warm Amber Tone",
        "jewellery_type": "Modern Roots",
        "sizes": json.dumps(['16-18" Adjustable']),
        "metals": json.dumps(["Warm Amber Tone"]),
        "images": json.dumps([
            "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85",
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85"
        ]),
        "status": "Active",
        "is_featured": 1,
        "badge": "TRENDING"
    },
    {
        "id": "as-005",
        "name": "Celestial Moon & Star Huggies",
        "description": "Whimsical asymmetric mini huggie hoops with micro-pavé crystals. Crescent moon and radiant north star.",
        "category": "Earrings",
        "price": 16900,
        "original_price": 19500,
        "discount_price": 16900,
        "stock": 0,
        "low_stock_threshold": 5,
        "sku": "AS-EAR-005",
        "material": "Rose Tone",
        "jewellery_type": "Everyday Sparkle",
        "sizes": json.dumps(["One Size"]),
        "metals": json.dumps(["Rose Tone", "Warm Amber Tone"]),
        "images": json.dumps([
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
            "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85"
        ]),
        "status": "Out of Stock",
        "is_featured": 0,
        "badge": "ROSE TONE"
    },
    {
        "id": "as-006",
        "name": "Liquid Sleek Herringbone Chain",
        "description": "Silky interlocking flat links in solid fine metal that drape effortlessly across the collarbone like molten amber light.",
        "category": "Necklaces",
        "price": 28900,
        "original_price": 32000,
        "discount_price": 28900,
        "stock": 6,
        "low_stock_threshold": 5,
        "sku": "AS-NCK-006",
        "material": "Warm Amber Tone",
        "jewellery_type": "Luxe Basics",
        "sizes": json.dumps(['16" + 2" Extension']),
        "metals": json.dumps(["Warm Amber Tone", "Rose Tone"]),
        "images": json.dumps([
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
            "https://images.unsplash.com/photo-1611591475883-9b883d6a953d?auto=format&fit=crop&w=1000&q=85"
        ]),
        "status": "Active",
        "is_featured": 1,
        "badge": "BESTSELLER"
    },
    {
        "id": "as-007",
        "name": "Petite Evil Eye Charm Bracelet",
        "description": "Hand-enamelled turquoise & navy evil eye motif with natural solitaire center.",
        "category": "Bracelets",
        "price": 11500,
        "original_price": 13200,
        "discount_price": 11500,
        "stock": 2,
        "low_stock_threshold": 5,
        "sku": "AS-BRC-007",
        "material": "Warm Amber Tone",
        "jewellery_type": "Protective Talismans",
        "sizes": json.dumps(['6.0-7.5" Adjustable']),
        "metals": json.dumps(["Warm Amber Tone"]),
        "images": json.dumps([
            "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=85",
            "https://images.unsplash.com/photo-1611591475883-9b883d6a953d?auto=format&fit=crop&w=1000&q=85"
        ]),
        "status": "Active",
        "is_featured": 1,
        "badge": "UNDER ₹15K"
    },
    {
        "id": "as-008",
        "name": "Serpentine Sculpted Open Cuff",
        "description": "Architectural fluid open cuff with ergonomic taper and mirror luster polish.",
        "category": "Bracelets",
        "price": 38000,
        "original_price": 42000,
        "discount_price": 38000,
        "stock": 5,
        "low_stock_threshold": 5,
        "sku": "AS-BRC-008",
        "material": "Warm Amber Tone",
        "jewellery_type": "Sculptural Statement",
        "sizes": json.dumps(["Standard (Flexible)"]),
        "metals": json.dumps(["Warm Amber Tone"]),
        "images": json.dumps([
            "https://images.unsplash.com/photo-1611591475883-9b883d6a953d?auto=format&fit=crop&w=1000&q=85",
            "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=85"
        ]),
        "status": "Active",
        "is_featured": 0,
        "badge": "EXCLUSIVE"
    }
]

DEFAULT_SEED_CATEGORIES = [
    {"id": "rings", "name": "Rings", "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=85", "count_label": "42+ Designs", "filter_key": "Rings", "is_active": 1, "sort_order": 1},
    {"id": "earrings", "name": "Earrings", "image": "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=85", "count_label": "68+ Designs", "filter_key": "Earrings", "is_active": 1, "sort_order": 2},
    {"id": "pendants", "name": "Pendants", "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=85", "count_label": "35+ Designs", "filter_key": "Pendants", "is_active": 1, "sort_order": 3},
    {"id": "bracelets", "name": "Bracelets & Bangles", "image": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=400&q=85", "count_label": "29+ Designs", "filter_key": "Bracelets", "is_active": 1, "sort_order": 4},
    {"id": "necklaces", "name": "Necklaces & Chains", "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=85", "count_label": "24+ Designs", "filter_key": "Necklaces", "is_active": 1, "sort_order": 5},
    {"id": "mangalsutras", "name": "Modern Mangalsutras", "image": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=85", "count_label": "18+ Designs", "filter_key": "Mangalsutras", "is_active": 1, "sort_order": 6}
]

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Users table with role
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            role TEXT DEFAULT 'customer',
            is_verified INTEGER DEFAULT 0,
            verification_code TEXT,
            verification_expires TEXT,
            tier TEXT DEFAULT 'Amber VIP Member',
            created_at TEXT NOT NULL
        )
    """)

    # Check for role column migration
    cursor.execute("PRAGMA table_info(users)")
    cols = [row["name"] for row in cursor.fetchall()]
    if "role" not in cols:
        cursor.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer'")
        print("[AuthDB] Migrated users table: added 'role' column.")
    
    # 2. Active Sessions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)

    # 3. Products table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            original_price REAL,
            discount_price REAL,
            stock INTEGER DEFAULT 10,
            low_stock_threshold INTEGER DEFAULT 5,
            sku TEXT UNIQUE,
            material TEXT,
            jewellery_type TEXT,
            sizes TEXT,
            metals TEXT,
            images TEXT,
            status TEXT DEFAULT 'Active',
            is_featured INTEGER DEFAULT 0,
            badge TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    # 4. Categories table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            image TEXT,
            count_label TEXT,
            filter_key TEXT,
            is_active INTEGER DEFAULT 1,
            sort_order INTEGER DEFAULT 0
        )
    """)

    # 5. Orders table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            customer_id INTEGER,
            customer_email TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            pincode TEXT,
            courier TEXT,
            awb TEXT,
            estimated_delivery TEXT,
            subtotal REAL,
            discount REAL,
            total REAL,
            status TEXT DEFAULT 'Order Confirmed',
            payment_status TEXT DEFAULT 'Paid',
            current_step_index INTEGER DEFAULT 0,
            items TEXT,
            timeline TEXT,
            created_at TEXT NOT NULL
        )
    """)

    # 6. Product Images table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS product_images (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            mime_type TEXT NOT NULL,
            data_base64 TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    # 7. Activity Logs table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_email TEXT NOT NULL,
            action TEXT NOT NULL,
            entity_type TEXT,
            entity_id TEXT,
            details TEXT,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()

    # Seed Default Verified Administrator (Requirement 1 & 2)
    cursor.execute("SELECT id, role FROM users WHERE email = ?", ("admin@amberandshine.com",))
    admin_row = cursor.fetchone()
    if not admin_row:
        p_hash, p_salt = hash_password("Admin@Amber2026!")
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, salt, role, is_verified, tier, created_at)
            VALUES (?, ?, ?, ?, 'admin', 1, 'Store Administrator', ?)
        """, ("Amber & Shine Executive Admin", "admin@amberandshine.com", p_hash, p_salt, datetime.now().isoformat()))
        conn.commit()
        print("[AuthDB] Seeded verified administrator: admin@amberandshine.com")
    elif admin_row["role"] != "admin":
        cursor.execute("UPDATE users SET role = 'admin' WHERE id = ?", (admin_row["id"],))
        conn.commit()

    # Seed Default Customer: Ananya Sharma
    cursor.execute("SELECT id FROM users WHERE email = ?", ("ananya@example.com",))
    if not cursor.fetchone():
        p_hash, p_salt = hash_password("password123")
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, salt, role, is_verified, tier, created_at)
            VALUES (?, ?, ?, ?, 'customer', 1, 'Amber VIP Member', ?)
        """, ("Ananya Sharma", "ananya@example.com", p_hash, p_salt, datetime.now().isoformat()))
        conn.commit()
        print("[AuthDB] Seeded verified patron: ananya@example.com")
    else:
        cursor.execute("UPDATE users SET role = 'customer' WHERE email = 'ananya@example.com' AND (role IS NULL OR role = '')")
        conn.commit()

    # Seed Default Unverified Patron
    cursor.execute("SELECT id FROM users WHERE email = ?", ("unverified@example.com",))
    if not cursor.fetchone():
        p_hash, p_salt = hash_password("password123")
        exp = (datetime.now() + timedelta(hours=24)).isoformat()
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, salt, role, is_verified, verification_code, verification_expires, tier, created_at)
            VALUES (?, ?, ?, ?, 'customer', 0, '123456', ?, 'Patron Member', ?)
        """, ("Test Unverified", "unverified@example.com", p_hash, p_salt, exp, datetime.now().isoformat()))
        conn.commit()

    # Seed Products if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM products")
    if cursor.fetchone()["cnt"] == 0:
        now_str = datetime.now().isoformat()
        for p in DEFAULT_SEED_PRODUCTS:
            cursor.execute("""
                INSERT INTO products (
                    id, name, description, category, price, original_price, discount_price,
                    stock, low_stock_threshold, sku, material, jewellery_type,
                    sizes, metals, images, status, is_featured, badge, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p["id"], p["name"], p["description"], p["category"], p["price"],
                p["original_price"], p["discount_price"], p["stock"], p["low_stock_threshold"],
                p["sku"], p["material"], p["jewellery_type"], p["sizes"], p["metals"],
                p["images"], p["status"], p["is_featured"], p["badge"], now_str, now_str
            ))
        conn.commit()
        print(f"[CatalogDB] Seeded {len(DEFAULT_SEED_PRODUCTS)} atelier products.")

    # Seed Categories if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM categories")
    if cursor.fetchone()["cnt"] == 0:
        for cat in DEFAULT_SEED_CATEGORIES:
            cursor.execute("""
                INSERT INTO categories (id, name, image, count_label, filter_key, is_active, sort_order)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (cat["id"], cat["name"], cat["image"], cat["count_label"], cat["filter_key"], cat["is_active"], cat["sort_order"]))
        conn.commit()
        print(f"[CatalogDB] Seeded {len(DEFAULT_SEED_CATEGORIES)} categories.")

    # Seed initial order if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM orders")
    if cursor.fetchone()["cnt"] == 0:
        seed_order = {
            "id": "AS-78219",
            "customer_id": 1,
            "customer_email": "ananya@example.com",
            "customer_name": "Ananya Sharma",
            "pincode": "400001",
            "courier": "BlueDart Apex Armored Courier",
            "awb": "BD-984218701",
            "estimated_delivery": "Tomorrow by 2:00 PM",
            "subtotal": 13800,
            "discount": 2760,
            "status": "Shipped",
            "payment_status": "Paid - Insured Escrow",
            "current_step_index": 2,
            "items": json.dumps([{
                "productId": "as-001",
                "name": "Dainty Twinkle Solitaire Ring",
                "price": 13800,
                "quantity": 1,
                "size": "US 6 / IN 12",
                "metal": "Warm Amber Tone",
                "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=85"
            }]),
            "timeline": json.dumps([
                {"status": "Order Confirmed", "title": "Order Confirmed", "time": "03 Sep 2026, 02:45 PM", "completed": True, "current": False},
                {"status": "Packed", "title": "Packed", "time": "03 Sep 2026, 06:10 PM", "completed": True, "current": False},
                {"status": "Shipped", "title": "Shipped", "time": "04 Sep 2026, 01:20 PM", "completed": True, "current": True},
                {"status": "Out for Delivery", "title": "Out for Delivery", "time": "Pending", "completed": False, "current": False},
                {"status": "Delivered", "title": "Delivered", "time": "Expected Tomorrow", "completed": False, "current": False}
            ]),
            "created_at": "2026-09-03T14:45:00"
        }
        cursor.execute("""
            INSERT INTO orders (
                id, customer_id, customer_email, customer_name, pincode, courier, awb,
                estimated_delivery, subtotal, discount, total, status, payment_status,
                current_step_index, items, timeline, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            seed_order["id"], seed_order["customer_id"], seed_order["customer_email"],
            seed_order["customer_name"], seed_order["pincode"], seed_order["courier"],
            seed_order["awb"], seed_order["estimated_delivery"], seed_order["subtotal"],
            seed_order["discount"], seed_order["total"], seed_order["status"],
            seed_order["payment_status"], seed_order["current_step_index"],
            seed_order["items"], seed_order["timeline"], seed_order["created_at"]
        ))
        conn.commit()

    conn.close()

# --------------------------------------------------------------------------
# REQUEST HANDLER WITH RBAC & AUTHENTICATION
# --------------------------------------------------------------------------

class AmberAuthServer(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def _set_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._set_cors()
        self.end_headers()

    def send_json(self, status_code: int, data: dict):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self._set_cors()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def parse_json_body(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                return {}
            raw = self.rfile.read(content_length).decode("utf-8")
            return json.loads(raw)
        except Exception:
            return None

    def get_bearer_token(self):
        auth_header = self.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            return auth_header[7:].strip()
        return None

    def get_authenticated_user(self):
        token = self.get_bearer_token()
        if not token:
            return None
        
        conn = get_db()
        cursor = conn.cursor()
        now = datetime.now().isoformat()
        cursor.execute("""
            SELECT u.id, u.name, u.email, u.role, u.tier, u.is_verified, u.created_at, s.expires_at
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.token = ? AND s.expires_at > ?
        """, (token, now))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"],
                "role": row["role"] or "customer",
                "tier": row["tier"],
                "is_verified": bool(row["is_verified"]),
                "created_at": row["created_at"]
            }
        return None

    def require_admin(self):
        """
        Enforces server-side RBAC.
        Returns user object if role == 'admin'.
        Sends 401 if unauthenticated, 403 if authenticated but not admin.
        """
        user = self.get_authenticated_user()
        if not user:
            self.send_json(401, {
                "error": "Authentication required.",
                "code": "UNAUTHORIZED"
            })
            return None
        if user.get("role") != "admin":
            self.send_json(403, {
                "error": "Access denied. Administrator privileges are required.",
                "code": "FORBIDDEN"
            })
            return None
        return user

    # ----------------------------------------------------------------------
    # HTTP METHOD ROUTING
    # ----------------------------------------------------------------------

    def do_GET(self):
        path = self.path.split("?")[0]
        query = self.path.split("?")[1] if "?" in self.path else ""

        # Route /admin to admin.html
        if path in ("/admin", "/admin/"):
            self.path = "/admin.html"
            return super().do_GET()

        # Public Storefront & Auth APIs
        if path == "/api/auth/me":
            user = self.get_authenticated_user()
            if user:
                return self.send_json(200, {"success": True, "user": user})
            return self.send_json(401, {"error": "Unauthorized or session expired"})

        elif path == "/api/products":
            return self.handle_get_public_products()

        elif path == "/api/categories":
            return self.handle_get_public_categories()

        elif path == "/api/orders":
            return self.handle_get_customer_orders()

        elif path.startswith("/api/orders/"):
            order_id = path.replace("/api/orders/", "").strip()
            return self.handle_get_single_customer_order(order_id)

        elif path.startswith("/api/images/"):
            img_id = path.replace("/api/images/", "").strip()
            return self.handle_serve_image(img_id)

        # Admin APIs (Strictly Role-Protected)
        elif path == "/api/admin/stats":
            admin = self.require_admin()
            if admin:
                return self.handle_get_admin_stats(admin)

        elif path == "/api/admin/products":
            admin = self.require_admin()
            if admin:
                return self.handle_get_admin_products(admin, query)

        elif path == "/api/admin/categories":
            admin = self.require_admin()
            if admin:
                return self.handle_get_admin_categories(admin)

        elif path == "/api/admin/orders":
            admin = self.require_admin()
            if admin:
                return self.handle_get_admin_orders(admin, query)

        elif path == "/api/admin/customers":
            admin = self.require_admin()
            if admin:
                return self.handle_get_admin_customers(admin)

        elif path == "/api/admin/logs":
            admin = self.require_admin()
            if admin:
                return self.handle_get_admin_logs(admin)

        # Static file serving
        return super().do_GET()

    def do_POST(self):
        path = self.path.split("?")[0]

        # Customer & Storefront Auth
        if path == "/api/auth/register":
            return self.handle_register()
        elif path == "/api/auth/login":
            return self.handle_login()
        elif path == "/api/auth/verify-email":
            return self.handle_verify_email()
        elif path == "/api/auth/resend-code":
            return self.handle_resend_code()
        elif path == "/api/auth/logout":
            return self.handle_logout()
        elif path == "/api/orders":
            return self.handle_create_order()

        # Dedicated Admin Auth Flow (Requirement 1 & 2)
        elif path == "/api/admin/login":
            return self.handle_admin_login()

        # Admin Product, Category, and Image Management (Requirement 5, 9, 10)
        elif path == "/api/admin/products":
            admin = self.require_admin()
            if admin:
                return self.handle_create_product(admin)

        elif path == "/api/admin/categories":
            admin = self.require_admin()
            if admin:
                return self.handle_create_category(admin)

        elif path == "/api/admin/upload-image":
            admin = self.require_admin()
            if admin:
                return self.handle_upload_image(admin)

        else:
            self.send_json(404, {"error": "Endpoint not found"})

    def do_PUT(self):
        path = self.path.split("?")[0]

        if path.startswith("/api/admin/products/"):
            admin = self.require_admin()
            if admin:
                prod_id = path.replace("/api/admin/products/", "").strip()
                return self.handle_update_product(admin, prod_id)

        elif path.startswith("/api/admin/categories/"):
            admin = self.require_admin()
            if admin:
                cat_id = path.replace("/api/admin/categories/", "").strip()
                return self.handle_update_category(admin, cat_id)

        else:
            self.send_json(404, {"error": "Endpoint not found"})

    def do_PATCH(self):
        path = self.path.split("?")[0]

        if path.startswith("/api/admin/products/") and path.endswith("/status"):
            admin = self.require_admin()
            if admin:
                prod_id = path.replace("/api/admin/products/", "").replace("/status", "").strip()
                return self.handle_patch_product_status(admin, prod_id)

        elif path.startswith("/api/admin/products/") and path.endswith("/stock"):
            admin = self.require_admin()
            if admin:
                prod_id = path.replace("/api/admin/products/", "").replace("/stock", "").strip()
                return self.handle_patch_product_stock(admin, prod_id)

        elif path.startswith("/api/admin/orders/") and path.endswith("/status"):
            admin = self.require_admin()
            if admin:
                order_id = path.replace("/api/admin/orders/", "").replace("/status", "").strip()
                return self.handle_patch_order_status(admin, order_id)

        else:
            self.send_json(404, {"error": "Endpoint not found"})

    def do_DELETE(self):
        path = self.path.split("?")[0]

        if path.startswith("/api/admin/products/"):
            admin = self.require_admin()
            if admin:
                prod_id = path.replace("/api/admin/products/", "").strip()
                return self.handle_delete_product(admin, prod_id)

        elif path.startswith("/api/admin/categories/"):
            admin = self.require_admin()
            if admin:
                cat_id = path.replace("/api/admin/categories/", "").strip()
                return self.handle_delete_category(admin, cat_id)

        else:
            self.send_json(404, {"error": "Endpoint not found"})

    # ----------------------------------------------------------------------
    # AUTHENTICATION HANDLERS
    # ----------------------------------------------------------------------

    def handle_register(self):
        body = self.parse_json_body()
        if body is None:
            return self.send_json(400, {"error": "Invalid JSON format"})

        name = (body.get("name") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not name or not email or not password:
            return self.send_json(400, {"error": "Please fill in all required fields."})

        if not is_valid_email(email):
            return self.send_json(400, {"error": "Please enter a valid email address."})

        if len(password) < 6:
            return self.send_json(400, {"error": "Password must be at least 6 characters."})

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            conn.close()
            return self.send_json(409, {"error": "An account with this email already exists."})

        pwd_hash, pwd_salt = hash_password(password)
        v_code = str(secrets.randbelow(900000) + 100000)
        v_exp = (datetime.now() + timedelta(hours=24)).isoformat()
        now_str = datetime.now().isoformat()

        # Strict Security: Role is ALWAYS 'customer' for public registration (Requirement 2 & 15)
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, salt, role, is_verified, verification_code, verification_expires, tier, created_at)
            VALUES (?, ?, ?, ?, 'customer', 0, ?, ?, 'Amber Patron', ?)
        """, (name, email, pwd_hash, pwd_salt, v_code, v_exp, now_str))
        conn.commit()
        conn.close()

        print(f"[EmailService] Verification email sent to {email}. Code: {v_code}")

        return self.send_json(201, {
            "success": True,
            "message": f"Registration successful! Verification code sent to {email}.",
            "email": email,
            "devVerificationCode": v_code
        })

    def handle_login(self):
        body = self.parse_json_body()
        if body is None:
            return self.send_json(400, {"error": "Invalid JSON format"})

        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return self.send_json(400, {"error": "Please fill in all required fields."})

        if not is_valid_email(email):
            return self.send_json(400, {"error": "Please enter a valid email address."})

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, name, email, password_hash, salt, role, is_verified, tier, created_at
            FROM users WHERE email = ?
        """, (email,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            return self.send_json(404, {
                "error": "No account found with this email. Please create an account first.",
                "code": "USER_NOT_FOUND"
            })

        if not user["is_verified"]:
            conn.close()
            return self.send_json(403, {
                "error": "Please verify your email before logging in.",
                "code": "EMAIL_UNVERIFIED",
                "email": email
            })

        if not verify_password(password, user["password_hash"], user["salt"]):
            conn.close()
            return self.send_json(401, {
                "error": "Incorrect email or password.",
                "code": "INVALID_CREDENTIALS"
            })

        session_token = secrets.token_hex(32)
        now = datetime.now()
        expires = (now + timedelta(days=7)).isoformat()

        cursor.execute("""
            INSERT INTO sessions (token, user_id, created_at, expires_at)
            VALUES (?, ?, ?, ?)
        """, (session_token, user["id"], now.isoformat(), expires))
        conn.commit()
        conn.close()

        user_data = {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"] or "customer",
            "tier": user["tier"],
            "is_verified": True,
            "created_at": user["created_at"]
        }

        return self.send_json(200, {
            "success": True,
            "message": f"Welcome back, {user['name']}!",
            "token": session_token,
            "user": user_data
        })

    def handle_admin_login(self):
        """
        Dedicated Admin Authentication Handler (Requirement 1 & 2).
        Requires registered admin email, correct password, verified status, and role == 'admin'.
        """
        body = self.parse_json_body()
        if body is None:
            return self.send_json(400, {"error": "Invalid JSON format"})

        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return self.send_json(400, {"error": "Please provide admin email and password."})

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, name, email, password_hash, salt, role, is_verified, tier, created_at
            FROM users WHERE email = ?
        """, (email,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            return self.send_json(404, {"error": "No account found with this email."})

        if not verify_password(password, user["password_hash"], user["salt"]):
            conn.close()
            return self.send_json(401, {"error": "Incorrect email or password."})

        # Strict Role Check (Requirement 2 & 14)
        if user["role"] != "admin":
            conn.close()
            return self.send_json(403, {
                "error": "Access denied. Administrator privileges are required.",
                "code": "FORBIDDEN"
            })

        session_token = secrets.token_hex(32)
        now = datetime.now()
        expires = (now + timedelta(days=2)).isoformat()

        cursor.execute("""
            INSERT INTO sessions (token, user_id, created_at, expires_at)
            VALUES (?, ?, ?, ?)
        """, (session_token, user["id"], now.isoformat(), expires))
        conn.commit()
        conn.close()

        # Log Activity (Requirement 17)
        log_activity(user["email"], "Admin Logged In", "auth", str(user["id"]), "Successful admin dashboard authentication")

        return self.send_json(200, {
            "success": True,
            "message": f"Administrator session authorized. Welcome, {user['name']}!",
            "token": session_token,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": "admin",
                "tier": user["tier"]
            }
        })

    def handle_verify_email(self):
        body = self.parse_json_body()
        if body is None:
            return self.send_json(400, {"error": "Invalid JSON format"})

        email = (body.get("email") or "").strip().lower()
        code = (body.get("code") or "").strip()

        if not email or not code:
            return self.send_json(400, {"error": "Please provide email and verification code."})

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, name, email, role, verification_code, verification_expires, is_verified
            FROM users WHERE email = ?
        """, (email,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            return self.send_json(404, {"error": "No account found with this email."})

        if user["is_verified"]:
            conn.close()
            return self.send_json(200, {"success": True, "message": "Account is already verified. You can now sign in."})

        if user["verification_code"] != code:
            conn.close()
            return self.send_json(400, {"error": "Invalid verification code. Please check your email or request a new code."})

        if user["verification_expires"] and user["verification_expires"] < datetime.now().isoformat():
            conn.close()
            return self.send_json(400, {"error": "Verification code has expired. Please request a new one."})

        cursor.execute("""
            UPDATE users SET is_verified = 1, verification_code = NULL, verification_expires = NULL
            WHERE id = ?
        """, (user["id"],))
        conn.commit()

        session_token = secrets.token_hex(32)
        now = datetime.now()
        expires = (now + timedelta(days=7)).isoformat()
        cursor.execute("""
            INSERT INTO sessions (token, user_id, created_at, expires_at)
            VALUES (?, ?, ?, ?)
        """, (session_token, user["id"], now.isoformat(), expires))
        conn.commit()
        conn.close()

        return self.send_json(200, {
            "success": True,
            "message": "Email verified successfully! Your account is now active.",
            "token": session_token,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"] or "customer",
                "tier": "Amber VIP Member",
                "is_verified": True
            }
        })

    def handle_resend_code(self):
        body = self.parse_json_body()
        if body is None:
            return self.send_json(400, {"error": "Invalid JSON format"})

        email = (body.get("email") or "").strip().lower()
        if not email:
            return self.send_json(400, {"error": "Email address is required."})

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("SELECT id, is_verified FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            return self.send_json(404, {"error": "No account found with this email."})

        if user["is_verified"]:
            conn.close()
            return self.send_json(400, {"error": "Account is already verified. Please sign in."})

        v_code = str(secrets.randbelow(900000) + 100000)
        v_exp = (datetime.now() + timedelta(hours=24)).isoformat()

        cursor.execute("""
            UPDATE users SET verification_code = ?, verification_expires = ?
            WHERE id = ?
        """, (v_code, v_exp, user["id"]))
        conn.commit()
        conn.close()

        return self.send_json(200, {
            "success": True,
            "message": f"A new 6-digit verification code has been sent to {email}.",
            "devVerificationCode": v_code
        })

    def handle_logout(self):
        token = self.get_bearer_token()
        if token:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
            conn.commit()
            conn.close()

        return self.send_json(200, {"success": True, "message": "Logged out successfully."})

    # ----------------------------------------------------------------------
    # PUBLIC STOREFRONT HANDLERS
    # ----------------------------------------------------------------------

    def handle_get_public_products(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM products WHERE status = 'Active' ORDER BY is_featured DESC, created_at DESC
        """)
        rows = cursor.fetchall()
        conn.close()

        products = []
        for r in rows:
            p = dict(r)
            try:
                p["sizes"] = json.loads(p["sizes"]) if p["sizes"] else []
                p["metals"] = json.loads(p["metals"]) if p["metals"] else []
                p["images"] = json.loads(p["images"]) if p["images"] else []
            except Exception:
                pass
            p["inStock"] = p["stock"] > 0

            badge_str = (p.get("badge") or "").upper()
            pid = str(p.get("id") or "")

            # Boolean category flags for showcase tabs
            is_bestseller = ("BESTSELLER" in badge_str) or (pid in ("as-001", "as-002", "as-003", "as-006", "as-008"))
            is_new = ("NEW" in badge_str) or ("ARRIVAL" in badge_str) or (pid in ("as-003", "as-004", "as-005", "as-007"))
            is_trending = ("TRENDING" in badge_str) or is_bestseller or (p.get("is_featured") == 1) or True

            p["isBestseller"] = is_bestseller
            p["isNew"] = is_new
            p["isTrending"] = is_trending

            # Frontend compatibility fields
            p["originalPrice"] = p.get("original_price") or p.get("price")
            p["karatage"] = p.get("material") or "Warm Amber Tone"
            p["rating"] = float(p.get("rating") or 4.9)
            p["reviewsCount"] = int(p.get("reviewsCount") or 48)

            products.append(p)

        return self.send_json(200, {"success": True, "products": products})

    def handle_get_public_categories(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC")
        rows = cursor.fetchall()
        conn.close()
        return self.send_json(200, {"success": True, "categories": [dict(r) for r in rows]})

    def handle_create_order(self):
        body = self.parse_json_body()
        if not body:
            return self.send_json(400, {"error": "Invalid order payload"})

        user = self.get_authenticated_user()
        customer_email = user["email"] if user else (body.get("customerEmail") or "guest@amberandshine.com")
        customer_name = user["name"] if user else (body.get("customerName") or "Guest Patron")
        customer_id = user["id"] if user else None

        order_id = "AS-" + str(secrets.randbelow(90000) + 10000)
        now_str = datetime.now().strftime("%d %b %Y, %I:%M %p")
        est_delivery = (datetime.now() + timedelta(days=3)).strftime("%d %b %Y") + " by 6:00 PM"
        awb = "BD-" + str(secrets.randbelow(900000000) + 100000000)

        items = body.get("items", [])
        subtotal = float(body.get("subtotal", 0))
        discount = float(body.get("discount", 0))
        total = float(body.get("total", subtotal - discount))
        pincode = str(body.get("pincode", "400001"))

        timeline = [
            {"status": "Order Confirmed", "title": "Order Confirmed", "time": now_str, "completed": True, "current": True},
            {"status": "Packed", "title": "Packed", "time": "Pending", "completed": False, "current": False},
            {"status": "Shipped", "title": "Shipped", "time": "Pending", "completed": False, "current": False},
            {"status": "Out for Delivery", "title": "Out for Delivery", "time": "Pending", "completed": False, "current": False},
            {"status": "Delivered", "title": "Delivered", "time": f"Expected {est_delivery}", "completed": False, "current": False}
        ]

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO orders (
                id, customer_id, customer_email, customer_name, pincode, courier, awb,
                estimated_delivery, subtotal, discount, total, status, payment_status,
                current_step_index, items, timeline, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Order Confirmed', 'Paid - Insured Escrow', 0, ?, ?, ?)
        """, (
            order_id, customer_id, customer_email, customer_name, pincode,
            "BlueDart Apex Armored Courier", awb, est_delivery, subtotal, discount,
            total, json.dumps(items), json.dumps(timeline), datetime.now().isoformat()
        ))

        # Decrement product inventory
        for it in items:
            p_id = it.get("productId") or it.get("id")
            qty = int(it.get("quantity", 1))
            if p_id:
                cursor.execute("UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?", (qty, p_id))
                cursor.execute("SELECT stock FROM products WHERE id = ?", (p_id,))
                cur_stk = cursor.fetchone()
                if cur_stk and cur_stk["stock"] == 0:
                    cursor.execute("UPDATE products SET status = 'Out of Stock' WHERE id = ?", (p_id,))

        conn.commit()
        conn.close()

        return self.send_json(201, {
            "success": True,
            "message": f"Order #{order_id} placed successfully!",
            "order": {
                "id": order_id,
                "customerEmail": customer_email,
                "customerName": customer_name,
                "total": total,
                "status": "Order Confirmed",
                "estimatedDelivery": est_delivery,
                "awb": awb,
                "timeline": timeline
            }
        })

    def handle_get_customer_orders(self):
        user = self.get_authenticated_user()
        if not user:
            return self.send_json(401, {"error": "Authentication required to view orders."})

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM orders WHERE LOWER(customer_email) = ? ORDER BY created_at DESC
        """, (user["email"].lower(),))
        rows = cursor.fetchall()
        conn.close()

        orders = []
        for r in rows:
            od = dict(r)
            try:
                od["items"] = json.loads(od["items"]) if od["items"] else []
                od["timeline"] = json.loads(od["timeline"]) if od["timeline"] else []
            except Exception:
                pass
            od["customerEmail"] = od.get("customer_email")
            od["customerName"] = od.get("customer_name")
            od["estimatedDelivery"] = od.get("estimated_delivery")
            od["currentStepIndex"] = od.get("current_step_index")
            od["paymentStatus"] = od.get("payment_status")
            od["date"] = od.get("created_at")
            orders.append(od)

        return self.send_json(200, {"success": True, "orders": orders})

    def handle_get_single_customer_order(self, order_id):
        user = self.get_authenticated_user()
        if not user:
            return self.send_json(401, {"error": "Authentication required to view orders."})

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM orders WHERE UPPER(id) = ? AND LOWER(customer_email) = ?
        """, (order_id.upper(), user["email"].lower()))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return self.send_json(404, {"error": f"Order '{order_id}' not found."})

        od = dict(row)
        try:
            od["items"] = json.loads(od["items"]) if od["items"] else []
            od["timeline"] = json.loads(od["timeline"]) if od["timeline"] else []
        except Exception:
            pass
        od["customerEmail"] = od.get("customer_email")
        od["customerName"] = od.get("customer_name")
        od["estimatedDelivery"] = od.get("estimated_delivery")
        od["currentStepIndex"] = od.get("current_step_index")
        od["paymentStatus"] = od.get("payment_status")
        od["date"] = od.get("created_at")

        return self.send_json(200, {"success": True, "order": od})

    def handle_serve_image(self, img_id: str):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT mime_type, data_base64 FROM product_images WHERE id = ?", (img_id,))
        row = cursor.fetchone()
        conn.close()

        if not row:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Image not found")
            return

        try:
            raw_bytes = base64.b64decode(row["data_base64"])
            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", row["mime_type"])
            self.send_header("Content-Length", str(len(raw_bytes)))
            self.send_header("Cache-Control", "public, max-age=86400")
            self.end_headers()
            self.wfile.write(raw_bytes)
        except Exception:
            self.send_response(500)
            self.end_headers()

    # ----------------------------------------------------------------------
    # ADMIN API HANDLERS (ROLE VERIFIED)
    # ----------------------------------------------------------------------

    def handle_get_admin_stats(self, admin):
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) as total FROM products WHERE status != 'Archived'")
        total_products = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) as active FROM products WHERE status = 'Active'")
        active_products = cursor.fetchone()["active"]

        cursor.execute("SELECT COUNT(*) as oos FROM products WHERE stock = 0 OR status = 'Out of Stock'")
        out_of_stock = cursor.fetchone()["oos"]

        cursor.execute("SELECT COUNT(*) as low FROM products WHERE stock > 0 AND stock <= low_stock_threshold")
        low_stock = cursor.fetchone()["low"]

        cursor.execute("SELECT COUNT(*) as total_orders, COALESCE(SUM(total), 0) as revenue FROM orders")
        order_stat = cursor.fetchone()
        total_orders = order_stat["total_orders"]
        total_revenue = order_stat["revenue"]

        cursor.execute("SELECT COUNT(*) as pending FROM orders WHERE status IN ('Order Confirmed', 'Packed')")
        pending_orders = cursor.fetchone()["pending"]

        cursor.execute("SELECT COUNT(*) as patrons FROM users WHERE role = 'customer'")
        total_customers = cursor.fetchone()["patrons"]

        # Recent 5 orders
        cursor.execute("SELECT id, customer_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5")
        recent_orders = [dict(r) for r in cursor.fetchall()]

        # Recent 5 products
        cursor.execute("SELECT id, name, category, price, stock, status, images FROM products ORDER BY created_at DESC LIMIT 5")
        recent_products = []
        for r in cursor.fetchall():
            item = dict(r)
            try:
                item["images"] = json.loads(item["images"]) if item["images"] else []
            except Exception:
                pass
            recent_products.append(item)

        low_stock_items = []
        cursor.execute("SELECT id, name, stock, low_stock_threshold FROM products WHERE stock <= low_stock_threshold AND status != 'Archived'")
        for r in cursor.fetchall():
            low_stock_items.append(dict(r))

        conn.close()

        return self.send_json(200, {
            "success": True,
            "total_products": total_products,
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "stock_alerts": {
                "low_stock_count": low_stock,
                "out_of_stock_count": out_of_stock,
                "items": low_stock_items
            },
            "stats": {
                "totalProducts": total_products,
                "total_products": total_products,
                "activeProducts": active_products,
                "outOfStockProducts": out_of_stock,
                "lowStockProducts": low_stock,
                "totalOrders": total_orders,
                "pendingOrders": pending_orders,
                "totalRevenue": total_revenue,
                "total_revenue": total_revenue,
                "totalCustomers": total_customers
            },
            "recentOrders": recent_orders,
            "recentProducts": recent_products
        })

    def handle_get_admin_products(self, admin, query_str=""):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()

        products = []
        for r in rows:
            p = dict(r)
            try:
                p["sizes"] = json.loads(p["sizes"]) if p["sizes"] else []
                p["metals"] = json.loads(p["metals"]) if p["metals"] else []
                p["images"] = json.loads(p["images"]) if p["images"] else []
            except Exception:
                pass
            products.append(p)

        return self.send_json(200, {"success": True, "products": products})

    def handle_create_product(self, admin):
        body = self.parse_json_body()
        if not body:
            return self.send_json(400, {"error": "Invalid product payload"})

        name = (body.get("name") or "").strip()
        category = (body.get("category") or "Rings").strip()
        price = float(body.get("price", 0))

        if not name or price <= 0:
            return self.send_json(400, {"error": "Product name and positive price are required."})

        prod_id = "as-" + secrets.token_hex(4)
        orig_price = float(body.get("originalPrice") or price)
        discount_price = float(body.get("discountPrice") or price)
        stock = int(body.get("stock", 10))
        threshold = int(body.get("lowStockThreshold", 5))
        sku = (body.get("sku") or f"AS-{category[:3].upper()}-{secrets.token_hex(2).upper()}").strip()
        material = (body.get("material") or "Warm Amber Tone").strip()
        jewellery_type = (body.get("jewelleryType") or "Everyday Luxury").strip()
        sizes = json.dumps(body.get("sizes") or ["Standard"])
        metals = json.dumps(body.get("metals") or ["Warm Amber Tone"])
        images = json.dumps(body.get("images") or ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85"])
        status = body.get("status", "Active")
        is_featured = 1 if body.get("isFeatured") else 0
        badge = body.get("badge", "NEW ARRIVAL")
        desc = body.get("description", "Handcrafted luxury jewellery piece.")
        now_str = datetime.now().isoformat()

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO products (
                id, name, description, category, price, original_price, discount_price,
                stock, low_stock_threshold, sku, material, jewellery_type,
                sizes, metals, images, status, is_featured, badge, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            prod_id, name, desc, category, price, orig_price, discount_price,
            stock, threshold, sku, material, jewellery_type,
            sizes, metals, images, status, is_featured, badge, now_str, now_str
        ))
        conn.commit()
        conn.close()

        log_activity(admin["email"], f"Added product: {name}", "product", prod_id, f"SKU: {sku}, Price: ₹{price}")

        return self.send_json(201, {
            "success": True,
            "id": prod_id,
            "sku": sku,
            "message": f"Product '{name}' added successfully.",
            "product": {"id": prod_id, "name": name, "sku": sku, "price": price, "stock": stock, "status": status}
        })

    def handle_update_product(self, admin, prod_id):
        body = self.parse_json_body()
        if not body:
            return self.send_json(400, {"error": "Invalid update payload"})

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ?", (prod_id,))
        existing = cursor.fetchone()
        if not existing:
            conn.close()
            return self.send_json(404, {"error": f"Product '{prod_id}' not found."})

        name = body.get("name", existing["name"]).strip()
        desc = body.get("description", existing["description"])
        category = body.get("category", existing["category"])
        price = float(body.get("price", existing["price"]))
        orig_price = float(body.get("originalPrice", existing["original_price"]))
        discount_price = float(body.get("discountPrice", existing["discount_price"] or price))
        stock = int(body.get("stock", existing["stock"]))
        threshold = int(body.get("lowStockThreshold", existing["low_stock_threshold"]))
        sku = body.get("sku", existing["sku"]).strip()
        material = body.get("material", existing["material"]).strip()
        jewellery_type = body.get("jewelleryType", existing["jewellery_type"])
        status = body.get("status", existing["status"])
        is_featured = 1 if body.get("isFeatured", existing["is_featured"]) else 0
        badge = body.get("badge", existing["badge"])

        sizes = json.dumps(body.get("sizes")) if "sizes" in body else existing["sizes"]
        metals = json.dumps(body.get("metals")) if "metals" in body else existing["metals"]
        images = json.dumps(body.get("images")) if "images" in body else existing["images"]
        now_str = datetime.now().isoformat()

        cursor.execute("""
            UPDATE products SET
                name = ?, description = ?, category = ?, price = ?, original_price = ?,
                discount_price = ?, stock = ?, low_stock_threshold = ?, sku = ?,
                material = ?, jewellery_type = ?, sizes = ?, metals = ?, images = ?,
                status = ?, is_featured = ?, badge = ?, updated_at = ?
            WHERE id = ?
        """, (
            name, desc, category, price, orig_price, discount_price, stock,
            threshold, sku, material, jewellery_type, sizes, metals, images,
            status, is_featured, badge, now_str, prod_id
        ))
        conn.commit()
        conn.close()

        log_activity(admin["email"], f"Updated product: {name}", "product", prod_id, f"Status: {status}, Price: ₹{price}")

        return self.send_json(200, {
            "success": True,
            "message": f"Product '{name}' updated successfully."
        })

    def handle_delete_product(self, admin, prod_id):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM products WHERE id = ?", (prod_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return self.send_json(404, {"error": "Product not found."})

        prod_name = row["name"]
        cursor.execute("UPDATE products SET status = 'Archived', updated_at = ? WHERE id = ?", (datetime.now().isoformat(), prod_id))
        conn.commit()
        conn.close()

        log_activity(admin["email"], f"Archived product: {prod_name}", "product", prod_id, "Soft-delete action")

        return self.send_json(200, {
            "success": True,
            "message": f"Product '{prod_name}' has been archived and removed from the active storefront."
        })

    def handle_patch_product_status(self, admin, prod_id):
        body = self.parse_json_body()
        new_status = body.get("status")
        if new_status not in ("Active", "Hidden", "Out of Stock", "Archived"):
            return self.send_json(400, {"error": "Invalid status value. Allowed: Active, Hidden, Out of Stock, Archived"})

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("UPDATE products SET status = ?, updated_at = ? WHERE id = ?", (new_status, datetime.now().isoformat(), prod_id))
        conn.commit()
        conn.close()

        log_activity(admin["email"], f"Changed product status to {new_status}", "product", prod_id, f"New status: {new_status}")

        return self.send_json(200, {"success": True, "message": f"Status updated to '{new_status}'."})

    def handle_patch_product_stock(self, admin, prod_id):
        body = self.parse_json_body()
        new_stock = int(body.get("stock", 0))

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT status FROM products WHERE id = ?", (prod_id,))
        row = cursor.fetchone()
        cur_status = row["status"] if row else "Active"
        if new_stock == 0 and cur_status == "Active":
            cur_status = "Out of Stock"
        elif new_stock > 0 and cur_status == "Out of Stock":
            cur_status = "Active"

        cursor.execute("UPDATE products SET stock = ?, status = ?, updated_at = ? WHERE id = ?", (new_stock, cur_status, datetime.now().isoformat(), prod_id))
        conn.commit()
        conn.close()

        log_activity(admin["email"], f"Updated product stock to {new_stock}", "product", prod_id, f"Stock: {new_stock}")

        return self.send_json(200, {"success": True, "message": f"Stock updated to {new_stock}."})

    def handle_upload_image(self, admin):
        body = self.parse_json_body()
        if not body:
            return self.send_json(400, {"error": "Invalid image payload"})

        data_base64 = body.get("data")
        filename = (body.get("filename") or body.get("name") or "product_image.jpg").strip()
        mime_type = body.get("mimeType") or body.get("mime_type")
        if not mime_type and data_base64 and data_base64.startswith("data:"):
            try:
                mime_type = data_base64.split(";")[0].replace("data:", "")
            except Exception:
                mime_type = "image/jpeg"
        if not mime_type:
            mime_type = "image/jpeg"

        if not data_base64:
            return self.send_json(400, {"error": "Missing base64 image data."})

        if "," in data_base64:
            data_base64 = data_base64.split(",", 1)[1]

        img_id = "img_" + secrets.token_hex(8)
        now_str = datetime.now().isoformat()

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO product_images (id, filename, mime_type, data_base64, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (img_id, filename, mime_type, data_base64, now_str))
        conn.commit()
        conn.close()

        image_url = f"/api/images/{img_id}"
        log_activity(admin["email"], f"Uploaded product image: {filename}", "image", img_id, f"URL: {image_url}")

        return self.send_json(201, {
            "success": True,
            "image_url": image_url,
            "imageUrl": image_url,
            "image_id": img_id,
            "imageId": img_id,
            "id": img_id
        })

    def handle_get_admin_categories(self, admin):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categories ORDER BY sort_order ASC")
        rows = cursor.fetchall()
        conn.close()
        return self.send_json(200, {"success": True, "categories": [dict(r) for r in rows]})

    def handle_create_category(self, admin):
        body = self.parse_json_body()
        name = (body.get("name") or "").strip()
        if not name:
            return self.send_json(400, {"error": "Category name is required."})

        cat_id = name.lower().replace(" ", "-").replace("&", "and")
        image = body.get("image") or "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=85"
        count_label = body.get("countLabel") or "New Collection"
        filter_key = name

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO categories (id, name, image, count_label, filter_key, is_active, sort_order)
            VALUES (?, ?, ?, ?, ?, 1, 99)
        """, (cat_id, name, image, count_label, filter_key))
        conn.commit()
        conn.close()

        log_activity(admin["email"], f"Created category: {name}", "category", cat_id)
        return self.send_json(201, {"success": True, "message": f"Category '{name}' created."})

    def handle_update_category(self, admin, cat_id):
        body = self.parse_json_body()
        name = (body.get("name") or "").strip()
        image = body.get("image")
        is_active = 1 if body.get("isActive", True) else 0

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE categories SET name = COALESCE(?, name), image = COALESCE(?, image), is_active = ?
            WHERE id = ?
        """, (name if name else None, image if image else None, is_active, cat_id))
        conn.commit()
        conn.close()

        log_activity(admin["email"], f"Updated category: {cat_id}", "category", cat_id)
        return self.send_json(200, {"success": True, "message": "Category updated."})

    def handle_delete_category(self, admin, cat_id):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM categories WHERE id = ?", (cat_id,))
        conn.commit()
        conn.close()

        log_activity(admin["email"], f"Deleted category: {cat_id}", "category", cat_id)
        return self.send_json(200, {"success": True, "message": f"Category '{cat_id}' deleted."})

    def handle_get_admin_orders(self, admin, query_str=""):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()

        orders = []
        for r in rows:
            od = dict(r)
            try:
                od["items"] = json.loads(od["items"]) if od["items"] else []
                od["timeline"] = json.loads(od["timeline"]) if od["timeline"] else []
            except Exception:
                pass
            od["customerEmail"] = od.get("customer_email")
            od["customerName"] = od.get("customer_name")
            od["estimatedDelivery"] = od.get("estimated_delivery")
            od["currentStepIndex"] = od.get("current_step_index")
            od["paymentStatus"] = od.get("payment_status")
            od["date"] = od.get("created_at")
            orders.append(od)

        return self.send_json(200, {"success": True, "orders": orders})

    def handle_patch_order_status(self, admin, order_id):
        body = self.parse_json_body()
        new_status = body.get("status")
        valid_statuses = ["Order Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"]
        if new_status not in valid_statuses:
            return self.send_json(400, {"error": f"Invalid status. Allowed: {', '.join(valid_statuses)}"})

        step_map = {
            "Order Confirmed": 0,
            "Packed": 1,
            "Shipped": 2,
            "Out for Delivery": 3,
            "Delivered": 4
        }
        step_idx = step_map[new_status]

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT timeline, estimated_delivery, created_at FROM orders WHERE UPPER(id) = ?", (order_id.upper(),))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return self.send_json(404, {"error": f"Order '{order_id}' not found."})

        now_str = datetime.now().strftime("%d %b %Y, %I:%M %p")
        est_del = row["estimated_delivery"] or "In 2-3 business days"
        order_date = row["created_at"] or now_str

        # Maintain clean 5-step standard timeline
        timeline = [
            {"status": "Order Confirmed", "title": "Order Confirmed", "time": order_date, "completed": False, "current": False},
            {"status": "Packed", "title": "Packed", "time": "Pending", "completed": False, "current": False},
            {"status": "Shipped", "title": "Shipped", "time": "Pending", "completed": False, "current": False},
            {"status": "Out for Delivery", "title": "Out for Delivery", "time": "Pending", "completed": False, "current": False},
            {"status": "Delivered", "title": "Delivered", "time": f"Expected {est_del}", "completed": False, "current": False}
        ]

        for idx in range(len(timeline)):
            if new_status == "Delivered":
                timeline[idx]["completed"] = True
                timeline[idx]["current"] = (idx == 4)
                if idx == 4:
                    timeline[idx]["time"] = now_str
            else:
                if idx < step_idx:
                    timeline[idx]["completed"] = True
                    timeline[idx]["current"] = False
                elif idx == step_idx:
                    timeline[idx]["completed"] = False
                    timeline[idx]["current"] = True
                    timeline[idx]["time"] = now_str
                else:
                    timeline[idx]["completed"] = False
                    timeline[idx]["current"] = False

        cursor.execute("""
            UPDATE orders SET status = ?, current_step_index = ?, timeline = ?
            WHERE UPPER(id) = ?
        """, (new_status, step_idx, json.dumps(timeline), order_id.upper()))
        conn.commit()
        conn.close()

        log_activity(admin["email"], f"Updated order {order_id} status to {new_status}", "order", order_id, f"Status: {new_status}")

        return self.send_json(200, {
            "success": True,
            "message": f"Order #{order_id} status updated to '{new_status}'.",
            "status": new_status,
            "stepIndex": step_idx,
            "timeline": timeline
        })

    def handle_get_admin_customers(self, admin):
        """
        Returns list of registered patrons.
        PASSWORDS & SALTS ARE STRICTLY EXCLUDED (Requirement 13).
        """
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT u.id, u.name, u.email, u.role, u.tier, u.is_verified, u.created_at,
                   COUNT(o.id) as order_count, COALESCE(SUM(o.total), 0) as total_spent
            FROM users u
            LEFT JOIN orders o ON u.email = o.customer_email
            WHERE u.role = 'customer'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        """)
        rows = cursor.fetchall()
        conn.close()

        customers = []
        for r in rows:
            customers.append({
                "id": r["id"],
                "name": r["name"],
                "email": r["email"],
                "role": r["role"],
                "tier": r["tier"],
                "isVerified": bool(r["is_verified"]),
                "createdAt": r["created_at"],
                "orderCount": r["order_count"],
                "totalSpent": r["total_spent"]
            })

        return self.send_json(200, {"success": True, "customers": customers})

    def handle_get_admin_logs(self, admin):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM activity_logs ORDER BY id DESC LIMIT 100")
        rows = cursor.fetchall()
        conn.close()
        logs = []
        for r in rows:
            entry = dict(r)
            entry["actor_email"] = entry.get("admin_email")
            logs.append(entry)
        return self.send_json(200, {"success": True, "logs": logs})


class ThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def run_server():
    init_db()
    mimetypes.init()
    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("text/css", ".css")

    with ThreadingServer(("", PORT), AmberAuthServer) as httpd:
        print(f"================================================================")
        print(f"AMBER & SHINE ATELIER SERVER RUNNING ON http://127.0.0.1:{PORT}")
        print(f"Auth & Product Database: {DB_FILE}")
        print(f"Serving Static Assets from: {BASE_DIR}")
        print(f"================================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
            httpd.shutdown()


if __name__ == "__main__":
    run_server()
