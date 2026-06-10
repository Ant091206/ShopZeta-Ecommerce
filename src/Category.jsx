import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://akashsir.in/atproject/at-shop/api/api-list-category.php", {
      headers: { Authorization: "Bearer dbacace63c8bf2885869b81660c2b289" }
    }).then(r => { if (r.data.category_list) setCategories(r.data.category_list); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div className="sz-spinner" /><span className="sz-muted">Loading categories...</span>
    </div>
  );

  return (
    <div className="container-xl py-4 px-3 px-md-4">
      <div className="mb-4">
        <div className="sz-sec-label">Explore Collections</div>
        <div className="sz-sec-title">Browse by Category</div>
        <div className="sz-sec-sub">Select a category to discover our curated products</div>
      </div>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
        {categories.map((cat, i) => (
          <div key={cat.category_id} className="col">
            <div className="sz-cat-card p-3 sz-fade-up" style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => navigate(`/subcategories/${cat.category_id}`)}>
              <div className="sz-cat-img-wrap mb-3">
                <img src={cat.category_image} alt={cat.category_name} style={{ width: "60px", height: "60px", objectFit: "contain" }} />
              </div>
              <div className="sz-text fw-bold" style={{ fontSize: "13.5px" }}>{cat.category_name}</div>
              <div className="sz-accent-c fw-semibold mt-1" style={{ fontSize: "11px", opacity: 0.7 }}>Explore →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;