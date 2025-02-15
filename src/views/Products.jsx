import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios";

function Products() {
  const [isPartLoading, setIsPartLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(1);
  const [productModal, setProductsModal] = useState({});
  const [cartInfos, setCartInfos] = useState([]);

  const { VITE_APP_API_BASE, VITE_APP_API_PATH } = import.meta.env;
  const navigate = useNavigate();
  useEffect(() => {
    getProducts();
    getCart();
  }, []);
  // react hook form
  const {
    register, // 用來註冊表單元素
    handleSubmit, // 用來處理表單提交
    formState: { errors }, // 用來顯示錯誤訊息
    reset, // 用來重置表單
  } = useForm({
    mode: "onChange",
    // 使用參數 defaultValues
    defaultValues: {
      name: "aaa",
      email: "aaa@email.com",
      tel: "0938593729",
      address: "dfdshui",
      comment: "",
    },
  });
  const onSubmit = (data) => {
    // 表單送出實際的資料內容
    if (cartInfos.carts.length < 1) {
      alert("請加入商品到購物車");
      return;
    }
    createOrder(data);
    setIsLoading(true);
    // setTimeout
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  const getProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${VITE_APP_API_BASE}/${VITE_APP_API_PATH}/products`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error("取得產品失敗", error);
    } finally {
      setIsLoading(false);
    }
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
    } catch (error) {
      console.error("加入購物車失敗", error);
    } finally {
      setIsPartLoading(false);
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
  const deleteOneFromCart = async (cartProduct_id) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `https://ec-course-api.hexschool.io/v2/api/wei777/cart/${cartProduct_id}`
      );
      await getCart();
    } catch (error) {
      console.error("刪除失敗", error);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteAllFromCart = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        "https://ec-course-api.hexschool.io/v2/api/wei777/carts",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log("刪除成功");
      getCart();
    } catch (error) {
      console.error("刪除失敗", error);
    } finally {
      setIsLoading(false);
    }
  };
  const createOrder = async (data) => {
    setIsLoading(true);
    try {
      const formData = {
        data: {
          user: {
            name: data.name,
            email: data.email,
            tel: data.tel,
            address: data.address,
          },
          message: data.comment,
        },
      };
      const API_URL = "https://ec-course-api.hexschool.io/v2/api/wei777/order";
      const response = await axios.post(API_URL, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log("訂單建立成功", response.data);
      getCart();
      reset();
    } catch (error) {
      console.error("訂單建立失敗", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div className="container">
        <div className="mt-4">
          {/* 產品Modal */}
          <div
            className="modal fade"
            id="productModal"
            tabIndex="-1"
            aria-labelledby="productModalLabel"
            aria-hidden="true"
          >
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
          </div>
          {/* 產品Modal */}
          <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                return (
                  <tr key={product.id}>
                    {/* imgae */}
                    <td style={{ width: "200px" }}>
                      <div
                        style={{
                          height: "100px",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundImage: `url(${product.imageUrl})`,
                        }}
                      ></div>
                    </td>
                    {/* product title */}
                    <td>{product.title}</td>
                    {/* price */}
                    <td>
                      <div className="h5">{product.price} 元</div>
                      <del className="h6">原價 {product.origin_price} 元</del>
                      <div className="h5"></div>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/product/${product.id}`);
                          }}
                        >
                          <div>查看更多</div>
                          {isPartLoading && (
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            const productFoundInTheCart = cartInfos.carts.find(
                              (cartProduct) => {
                                return cartProduct.product.id === product.id;
                              }
                            );

                            if (productFoundInTheCart !== undefined) {
                              updateProductToCart(
                                productFoundInTheCart.id,
                                productFoundInTheCart.qty + 1
                              );
                            } else {
                              addProductToCart(product.id, 1);
                            }
                          }}
                        >
                          <div>加到購物車</div>
                          {isPartLoading && (
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

export default Products;
