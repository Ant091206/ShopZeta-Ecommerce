import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function SubCategoryList() {
  const { categoryId } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://akashsir.in/atproject/at-shop/api/api-list-subcategory.php", {
      headers: { Authorization: "Bearer dbacace63c8bf2885869b81660c2b289" }
    }).then(r => { if (r.data.subcategory_list) setSubCategories(r.data.subcategory_list); })
      .catch(console.error).finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div className="sz-spinner" /><span className="sz-muted">Loading...</span>
    </div>
  );

  return (
    <div className="container-xl py-4 px-3 px-md-4">
      <button className="sz-btn sz-btn-outline mb-4" style={{ fontSize: "13px" }} onClick={() => navigate(-1)}>← Back</button>
      <div className="mb-4">
        <div className="sz-sec-label">Navigation</div>
        <div className="sz-sec-title">Subcategories</div>
      </div>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
        {subCategories.map((sub, i) => (
          <div key={sub.subcategory_id} className="col">
            <div className="sz-cat-card p-3 sz-fade-up" style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => navigate(`/products/subcategory/${sub.subcategory_id}`)}>
              <div className="sz-cat-img-wrap mb-3">
                <img src={sub.subcategory_image} alt={sub.subcategory_name} style={{ width: "54px", height: "54px", objectFit: "contain" }} />
              </div>
              <div className="sz-text fw-bold" style={{ fontSize: "13px" }}>{sub.subcategory_name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubCategoryList;