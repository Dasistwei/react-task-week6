import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
function Product() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPartLoading, setIsPartLoading] = useState(false);
  const [productCount, setProductCount] = useState(1);
  const [productModal, setProductsModal] = useState({});
  const [cartInfos, setCartInfos] = useState([]);

  const { VITE_APP_API_BASE, VITE_APP_API_PATH } = import.meta.env;
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  useEffect(() => {
    getProduct();
    getCart();
  }, []);
  const getProduct = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${VITE_APP_API_BASE}/${VITE_APP_API_PATH}/product/${id}`
      );
      // console.log("取得產品成功", response.data.product);
      setProductsModal(response.data.product);
    } catch (error) {
      console.error("取得產品失敗", error);
    } finally {
      setIsLoading(false);
    }
  };
  const updateProductToCart = async (cartProduct_id, cartProductCount) => {
    console.log("cartProduct_id", cartProduct_id, cartProductCount);
    setIsPartLoading(true);
    try {
      await axios.put(
        `https://ec-course-api.hexschool.io/v2/api/wei777/cart/${cartProduct_id}`,
        {
          data: {
            product_id: cartProduct_id,
            qty: cartProductCount,
          },
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("更新購物車成功");
      getCart();
      navigate("/cart");
    } catch (error) {
      console.error("更新購物車失敗", error);
    } finally {
      setIsPartLoading(false);
    }
  };
  const getCart = () => {
    axios
      .get("https://ec-course-api.hexschool.io/v2/api/wei777/cart")
      .then((res) => {
        setCartInfos(res.data.data);
      });
  };
  const addProductToCart = async (product_id, qty) => {
    setIsPartLoading(true);
    try {
      const API_URL = "https://ec-course-api.hexschool.io/v2/api/wei777/cart";
      // const API_URL = `${VITE_APP_API_BASE}/${VITE_APP_API_PATH}/cart/${cart.id}`;
      const postData = {
        data: {
          product_id,
          qty,
        },
      };
      await axios.post(API_URL, postData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      getCart();
      console.log("加入購物車成功");
      navigate("/cart");
    } catch (error) {
      console.error("加入購物車失敗", error);
    } finally {
      setIsPartLoading(false);
    }
  };
  return (
    <div>
      <h1>Product</h1>
      <div className="modal-dialog" key={productModal.id}>
        <div className="modal-content">
          {/* title */}
          <div className="modal-header">
            <h5 className="modal-title" id="productModalLabel">
              產品名稱: {productModal.title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-start">
            <img src={productModal.imageUrl} alt="" />
            <p>內容: {productModal.content}</p>
            <p>描述: {productModal.description}</p>
            <p>
              價錢 : <del>原價 ${productModal.origin_price}</del>， 特價 :{" "}
              {productModal.price}元
            </p>
            <div className="d-flex align-items-center">
              <label htmlFor="">購買數量:</label>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (productCount <= 1) return;
                  setProductCount((productCount) => productCount - 1);
                }}
              >
                -
              </button>
              <input
                type="number"
                name=""
                id=""
                min="1"
                max="10"
                value={productCount}
                onChange={(e) => {
                  setProductCount(e.target.value);
                }}
                className="form-control"
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  setProductCount((productCount) => productCount + 1);
                }}
              >
                +
              </button>
            </div>
          </div>
          {/* add to cart btn */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary d-flex"
              onClick={() => {
                const productFoundInTheCart = cartInfos.carts.find(
                  (cartProduct) => {
                    return cartProduct.product.id === productModal.id;
                  }
                );
                if (productFoundInTheCart !== undefined) {
                  updateProductToCart(
                    productFoundInTheCart.id,
                    productCount + 1
                  );
                } else {
                  addProductToCart(productModal.id, 1);
                }
              }}
            >
              <div>加入購物車</div>
              {isPartLoading && (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      {isLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 99911,
          }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default Product;
