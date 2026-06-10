import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

/* ── Inline styles using CSS vars so light/dark mode both work ── */
const S = {
  panel: {
    background: "var(--sz-surface)",
    border: "1px solid var(--sz-border)",
    borderRadius: "16px",
    padding: "20px",
    position: "sticky",
    top: "calc(68px + 16px)",
    maxHeight: "calc(100vh - 100px)",
    overflowY: "auto",
    scrollbarWidth: "thin",
  },
  sectionTitle: {
    fontSize: "11px", fontWeight: 800, color: "var(--sz-accent)",
    letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  divider: {
    height: "1px", background: "var(--sz-border)", margin: "18px 0",
  },
  checkRow: {
    display: "flex", alignItems: "center", gap: "9px",
    padding: "6px 8px", borderRadius: "8px", cursor: "pointer",
    transition: "background 150ms ease",
  },
  checkbox: {
    width: "16px", height: "16px", borderRadius: "4px",
    border: "1.5px solid var(--sz-border)",
    background: "var(--sz-surface2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all 150ms ease",
    fontSize: "10px",
  },
  checkboxActive: {
    background: "var(--sz-accent)",
    border: "1.5px solid var(--sz-accent)",
    boxShadow: "0 0 0 3px var(--sz-glow)",
  },
  tag: {
    padding: "4px 10px", borderRadius: "20px", fontSize: "12px",
    fontWeight: 600, cursor: "pointer", border: "1px solid var(--sz-border)",
    background: "var(--sz-surface2)", color: "var(--sz-muted)",
    transition: "all 150ms ease", userSelect: "none",
  },
  tagActive: {
    background: "rgba(99,102,241,0.12)", border: "1px solid var(--sz-accent)",
    color: "var(--sz-accent)",
  },
  rangeTrack: {
    width: "100%", height: "4px", borderRadius: "2px",
    background: "var(--sz-surface3, #1e1e28)",
    position: "relative", margin: "8px 0",
  },
  clearBtn: {
    fontSize: "11px", fontWeight: 700, color: "var(--sz-accent)",
    background: "none", border: "none", cursor: "pointer",
    fontFamily: "inherit", padding: 0,
  },
};

function FilterPanel({ products, filters, setFilters, onClear }) {
  const [priceExpanded, setPriceExpanded]     = useState(true);
  const [ratingExpanded, setRatingExpanded]   = useState(true);
  const [sortExpanded, setSortExpanded]       = useState(true);
  const [availExpanded, setAvailExpanded]     = useState(true);
  const [hoveredRow, setHoveredRow]           = useState(null);

  /* Derive price range from actual products */
  const maxPrice = useMemo(() =>
    products.length ? Math.ceil(Math.max(...products.map(p => parseFloat(p.product_price) || 0)) / 100) * 100 : 100000
  , [products]);

  const minPrice = useMemo(() =>
    products.length ? Math.floor(Math.min(...products.map(p => parseFloat(p.product_price) || 0)) / 100) * 100 : 0
  , [products]);

  /* Set default price range when products load */
  useEffect(() => {
    if (products.length && filters.priceMax === 999999) {
      setFilters(f => ({ ...f, priceMin: minPrice, priceMax: maxPrice }));
    }
  }, [products]);

  const sortOptions = [
    { value: "default",    label: "Default"         },
    { value: "price-asc",  label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "name-asc",   label: "Name: A → Z"      },
    { value: "name-desc",  label: "Name: Z → A"      },
  ];

  const ratingOptions = [5, 4, 3, 2, 1];

  const Section = ({ title, expanded, toggle, hasActive, children }) => (
    <div>
      <div style={S.sectionTitle}>
        <span>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {hasActive && (
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "var(--sz-accent)", display: "inline-block"
            }}/>
          )}
          <button onClick={toggle} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--sz-muted)", fontSize: "14px", padding: 0,
            transition: "transform 200ms ease",
            transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
          }}>▾</button>
        </div>
      </div>
      {expanded && children}
    </div>
  );

  return (
    <div style={S.panel}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sz-accent)" strokeWidth="2.5" strokeLinecap="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--sz-text)" }}>Filters</span>
        </div>
        <button onClick={onClear} style={S.clearBtn}>Clear all</button>
      </div>

      {/* ── SORT BY ── */}
      <Section title="Sort By" expanded={sortExpanded} toggle={() => setSortExpanded(p => !p)}
        hasActive={filters.sort !== "default"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {sortOptions.map(opt => (
            <div key={opt.value}
              onClick={() => setFilters(f => ({ ...f, sort: opt.value }))}
              onMouseEnter={() => setHoveredRow(`sort-${opt.value}`)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                ...S.checkRow,
                background: filters.sort === opt.value
                  ? "rgba(99,102,241,0.08)"
                  : hoveredRow === `sort-${opt.value}` ? "var(--sz-surface2)" : "transparent",
              }}>
              <div style={{
                ...S.checkbox,
                ...(filters.sort === opt.value ? S.checkboxActive : {}),
                borderRadius: "50%",
              }}>
                {filters.sort === opt.value && "●"}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--sz-text)" }}>{opt.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <div style={S.divider}/>

      {/* ── PRICE RANGE ── */}
      <Section title="Price Range" expanded={priceExpanded} toggle={() => setPriceExpanded(p => !p)}
        hasActive={filters.priceMin > minPrice || filters.priceMax < maxPrice}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--sz-accent)" }}>₹{filters.priceMin.toLocaleString()}</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--sz-accent)" }}>₹{filters.priceMax.toLocaleString()}</span>
        </div>
        {/* Min price slider */}
        <div style={{ marginBottom: "8px" }}>
          <label style={{ fontSize: "11px", color: "var(--sz-muted)", fontWeight: 600 }}>Min Price</label>
          <input type="range"
            min={minPrice} max={maxPrice} step={100}
            value={filters.priceMin}
            onChange={e => {
              const val = Number(e.target.value);
              if (val < filters.priceMax) setFilters(f => ({ ...f, priceMin: val }));
            }}
            style={{ width: "100%", accentColor: "var(--sz-accent)", cursor: "pointer", marginTop: "4px" }}
          />
        </div>
        {/* Max price slider */}
        <div>
          <label style={{ fontSize: "11px", color: "var(--sz-muted)", fontWeight: 600 }}>Max Price</label>
          <input type="range"
            min={minPrice} max={maxPrice} step={100}
            value={filters.priceMax}
            onChange={e => {
              const val = Number(e.target.value);
              if (val > filters.priceMin) setFilters(f => ({ ...f, priceMax: val }));
            }}
            style={{ width: "100%", accentColor: "var(--sz-accent)", cursor: "pointer", marginTop: "4px" }}
          />
        </div>

        {/* Quick price tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
          {[
            { label: "Under ₹500",  min: 0,     max: 500   },
            { label: "₹500–₹2K",   min: 500,   max: 2000  },
            { label: "₹2K–₹10K",   min: 2000,  max: 10000 },
            { label: "₹10K+",       min: 10000, max: maxPrice },
          ].map(r => {
            const active = filters.priceMin === r.min && filters.priceMax === r.max;
            return (
              <span key={r.label}
                onClick={() => setFilters(f => ({ ...f, priceMin: r.min, priceMax: r.max }))}
                style={{ ...S.tag, ...(active ? S.tagActive : {}) }}>
                {r.label}
              </span>
            );
          })}
        </div>
      </Section>

      <div style={S.divider}/>

      {/* ── MIN RATING ── */}
      <Section title="Min Rating" expanded={ratingExpanded} toggle={() => setRatingExpanded(p => !p)}
        hasActive={filters.minRating > 0}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {ratingOptions.map(r => {
            const active = filters.minRating === r;
            return (
              <span key={r}
                onClick={() => setFilters(f => ({ ...f, minRating: active ? 0 : r }))}
                style={{ ...S.tag, ...(active ? S.tagActive : {}) }}>
                {"★".repeat(r)} {r}+
              </span>
            );
          })}
        </div>
      </Section>

      <div style={S.divider}/>

      {/* ── AVAILABILITY ── */}
      <Section title="Availability" expanded={availExpanded} toggle={() => setAvailExpanded(p => !p)}
        hasActive={filters.inStockOnly}>
        <div
          onClick={() => setFilters(f => ({ ...f, inStockOnly: !f.inStockOnly }))}
          onMouseEnter={() => setHoveredRow("stock")}
          onMouseLeave={() => setHoveredRow(null)}
          style={{
            ...S.checkRow,
            background: filters.inStockOnly
              ? "rgba(99,102,241,0.08)"
              : hoveredRow === "stock" ? "var(--sz-surface2)" : "transparent",
          }}>
          <div style={{ ...S.checkbox, ...(filters.inStockOnly ? S.checkboxActive : {}) }}>
            {filters.inStockOnly && "✓"}
          </div>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--sz-text)" }}>In Stock Only</span>
        </div>
      </Section>

      <div style={S.divider}/>

      {/* ── SEARCH ── */}
      <div>
        <div style={S.sectionTitle}>
          <span>Search</span>
        </div>
        <div style={{ position: "relative" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sz-muted)" strokeWidth="2"
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            style={{
              width: "100%", padding: "9px 12px 9px 32px",
              background: "var(--sz-surface2)", border: "1px solid var(--sz-border)",
              borderRadius: "8px", color: "var(--sz-text)", fontSize: "13px",
              fontFamily: "inherit", outline: "none",
              transition: "border-color 150ms ease, box-shadow 150ms ease",
            }}
            onFocus={e => { e.target.style.borderColor = "var(--sz-accent)"; e.target.style.boxShadow = "0 0 0 3px var(--sz-glow)"; }}
            onBlur={e => { e.target.style.borderColor = "var(--sz-border)"; e.target.style.boxShadow = "none"; }}
          />
        </div>
      </div>

      {/* ── ACTIVE FILTERS SUMMARY ── */}
      {(filters.search || filters.minRating > 0 || filters.inStockOnly || filters.sort !== "default" ||
        filters.priceMin > minPrice || filters.priceMax < maxPrice) && (
        <div style={{ marginTop: "16px", padding: "10px 12px", background: "rgba(99,102,241,0.07)", borderRadius: "10px", border: "1px solid rgba(99,102,241,0.15)" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--sz-accent)", marginBottom: "6px" }}>ACTIVE FILTERS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {filters.sort !== "default" && (
              <span style={{ ...S.tag, ...S.tagActive, fontSize: "11px", padding: "2px 8px" }}>
                {sortOptions.find(s => s.value === filters.sort)?.label}
                <button onClick={() => setFilters(f => ({ ...f, sort: "default" }))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sz-accent)", marginLeft: "4px", padding: 0, fontSize: "11px" }}>✕</button>
              </span>
            )}
            {(filters.priceMin > minPrice || filters.priceMax < maxPrice) && (
              <span style={{ ...S.tag, ...S.tagActive, fontSize: "11px", padding: "2px 8px" }}>
                ₹{filters.priceMin.toLocaleString()}–₹{filters.priceMax.toLocaleString()}
                <button onClick={() => setFilters(f => ({ ...f, priceMin: minPrice, priceMax: maxPrice }))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sz-accent)", marginLeft: "4px", padding: 0, fontSize: "11px" }}>✕</button>
              </span>
            )}
            {filters.minRating > 0 && (
              <span style={{ ...S.tag, ...S.tagActive, fontSize: "11px", padding: "2px 8px" }}>
                {"★".repeat(filters.minRating)}+
                <button onClick={() => setFilters(f => ({ ...f, minRating: 0 }))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sz-accent)", marginLeft: "4px", padding: 0, fontSize: "11px" }}>✕</button>
              </span>
            )}
            {filters.inStockOnly && (
              <span style={{ ...S.tag, ...S.tagActive, fontSize: "11px", padding: "2px 8px" }}>
                In Stock
                <button onClick={() => setFilters(f => ({ ...f, inStockOnly: false }))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sz-accent)", marginLeft: "4px", padding: 0, fontSize: "11px" }}>✕</button>
              </span>
            )}
            {filters.search && (
              <span style={{ ...S.tag, ...S.tagActive, fontSize: "11px", padding: "2px 8px" }}>
                "{filters.search}"
                <button onClick={() => setFilters(f => ({ ...f, search: "" }))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sz-accent)", marginLeft: "4px", padding: 0, fontSize: "11px" }}>✕</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN PRODUCT PAGE
══════════════════════════════════════ */
const DEFAULT_FILTERS = {
  sort:        "default",
  priceMin:    0,
  priceMax:    999999,
  minRating:   0,
  inStockOnly: false,
  search:      "",
};

function Product() {
  const { subCategoryId } = useParams();
  const [products,      setProducts]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [cartLoadingId, setCartLoadingId] = useState(null);
  const [addedId,       setAddedId]       = useState(null);
  const [filters,       setFilters]       = useState(DEFAULT_FILTERS);
  const [sidebarOpen,   setSidebarOpen]   = useState(false); // mobile
  const navigate = useNavigate();
  const token = API_TOKEN;

  useEffect(() => {
    setLoading(true);
    setFilters(DEFAULT_FILTERS);
          let url = `${API_BASE}/api-list-product.php`;
    if (subCategoryId) url += `?sub_category_id=${subCategoryId}`;
    axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setProducts(r.data?.product_list || []))
      .catch(console.error).finally(() => setLoading(false));
  }, [subCategoryId]);

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    const s = JSON.parse(localStorage.getItem("userSession"));
    if (!s?.user_id) { alert("Please login first."); navigate("/login"); return; }
    setCartLoadingId(productId);
    const fd = new FormData();
    fd.append("user_id", s.user_id); fd.append("product_id", productId); fd.append("product_qty", "1");
    try {
      const r = await axios.post(`${API_BASE}/api-add-cart.php`, fd, { headers: { Authorization: `Bearer ${token}` } });
      if (r.data.flag === "1" || r.data.status === "1") {
        setAddedId(productId); setTimeout(() => setAddedId(null), 2000);
      } else alert(r.data.message || "Could not add to cart.");
    } catch(err) { console.error(err); } finally { setCartLoadingId(null); }
  };

  /* ── Apply all filters + sort ── */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* Search */
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.product_name?.toLowerCase().includes(q) ||
        p.product_details?.toLowerCase().includes(q)
      );
    }

    /* Price range */
    result = result.filter(p => {
      const price = parseFloat(p.product_price) || 0;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    /* Rating */
    if (filters.minRating > 0) {
      result = result.filter(p => parseFloat(p.product_rating || 0) >= filters.minRating);
    }

    /* Sort */
    switch (filters.sort) {
      case "price-asc":  result.sort((a,b) => parseFloat(a.product_price) - parseFloat(b.product_price)); break;
      case "price-desc": result.sort((a,b) => parseFloat(b.product_price) - parseFloat(a.product_price)); break;
      case "name-asc":   result.sort((a,b) => (a.product_name||"").localeCompare(b.product_name||"")); break;
      case "name-desc":  result.sort((a,b) => (b.product_name||"").localeCompare(a.product_name||"")); break;
      default: break;
    }

    return result;
  }, [products, filters]);

  const activeFilterCount = [
    filters.sort !== "default",
    filters.priceMin > 0 || filters.priceMax < 999999,
    filters.minRating > 0,
    filters.inStockOnly,
    !!filters.search,
  ].filter(Boolean).length;

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div className="sz-spinner"/><span className="sz-muted">Loading products...</span>
    </div>
  );

  return (
    <div className="container-xl py-4 px-3 px-md-4">

      {/* ── Page header ── */}
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <div className="sz-sec-label">{subCategoryId ? "Filtered Results" : "All Products"}</div>
          <div className="sz-sec-title">{subCategoryId ? "Subcategory Products" : "Our Products"}</div>
          <div className="sz-sec-sub">
            {filteredProducts.length} of {products.length} items
            {activeFilterCount > 0 && (
              <span style={{ marginLeft: "8px", padding: "2px 8px", borderRadius: "99px",
                background: "rgba(99,102,241,0.12)", color: "var(--sz-accent)",
                fontSize: "11px", fontWeight: 700 }}>
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
              </span>
            )}
          </div>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setSidebarOpen(p => !p)}
          className="d-lg-none sz-btn sz-btn-outline"
          style={{ fontSize: "13px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <div className="row g-4 align-items-start">

        {/* ── FILTER SIDEBAR — desktop always visible, mobile overlay ── */}
        <div className="col-lg-3 d-none d-lg-block">
          <FilterPanel
            products={products}
            filters={filters}
            setFilters={setFilters}
            onClear={clearFilters}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 1040,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          }}
            onClick={() => setSidebarOpen(false)}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: "min(320px, 90vw)",
              background: "var(--sz-surface)",
              padding: "20px", overflowY: "auto",
              animation: "sz-slide-in 0.25s var(--ease-out) both",
            }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--sz-text)" }}>Filters</span>
                <button onClick={() => setSidebarOpen(false)} style={{
                  background: "var(--sz-surface2)", border: "1px solid var(--sz-border)",
                  borderRadius: "8px", width: "32px", height: "32px",
                  cursor: "pointer", color: "var(--sz-text)", fontSize: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>
              </div>
              <FilterPanel
                products={products}
                filters={filters}
                setFilters={setFilters}
                onClear={clearFilters}
              />
            </div>
          </div>
        )}

        {/* ── PRODUCT GRID ── */}
        <div className="col-lg-9">
          {filteredProducts.length === 0 ? (
            <div style={{
              background: "var(--sz-surface)", border: "1px solid var(--sz-border)",
              borderRadius: "16px", padding: "64px 24px", textAlign: "center",
            }}>
              <div style={{ fontSize: "48px", opacity: 0.3, marginBottom: "16px" }}>🔍</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--sz-text)", marginBottom: "8px" }}>
                No products match your filters
              </div>
              <div style={{ color: "var(--sz-muted)", marginBottom: "24px", fontSize: "14px" }}>
                Try adjusting your price range or removing some filters.
              </div>
              <button className="sz-btn sz-btn-primary" onClick={clearFilters}
                style={{ padding: "10px 24px", fontSize: "14px" }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 g-3">
              {filteredProducts.map((item, i) => (
                <div key={item.product_id} className="col">
                  <div className="sz-product-card h-100 sz-fade-up"
                    style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                    onClick={() => navigate(`/product-details/${item.product_id}`)}>
                    <div className="sz-product-img">
                      <img src={item.product_image} alt={item.product_name}/>
                      {addedId === item.product_id && (
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "rgba(16,185,129,0.15)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ fontSize: "28px" }}>✓</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 d-flex flex-column gap-2 flex-grow-1">
                      <div className="sz-text fw-semibold" style={{
                        fontSize: "13.5px", lineHeight: "1.4",
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {item.product_name}
                      </div>
                      <div className="sz-price mt-1">₹{parseFloat(item.product_price).toLocaleString()}</div>
                      <button
                        className="sz-btn w-100 mt-auto"
                        style={{
                          background: addedId === item.product_id ? "var(--sz-success)" : "var(--sz-accent)",
                          color: "#fff", fontSize: "13px", padding: "9px",
                        }}
                        onClick={(e) => handleAddToCart(e, item.product_id)}
                        disabled={cartLoadingId === item.product_id}
                      >
                        {cartLoadingId === item.product_id ? "Adding..." :
                          addedId === item.product_id ? "✓ Added!" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar slide-in keyframe */}
      <style>{`
        @keyframes sz-slide-in {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Product;