import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
function Cart() {
  const [cartInfos, setCartInfos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPartLoading, setIsPartLoading] = useState(false);
  const { VITE_APP_API_BASE, VITE_APP_API_PATH } = import.meta.env;
  const navigate = useNavigate();
  useEffect(() => {
    getCart();
  }, []);
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
  const getCart = () => {
    axios.get(`${VITE_APP_API_BASE}/${VITE_APP_API_PATH}/cart`).then((res) => {
      setCartInfos(res.data.data);
    });
  };
  const deleteOneFromCart = async (cartProduct_id) => {
    setIsLoading(true);

    try {
      await axios.delete(
        `${VITE_APP_API_BASE}/${VITE_APP_API_PATH}/cart/${cartProduct_id}`
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
      await axios.delete(`${VITE_APP_API_BASE}/${VITE_APP_API_PATH}/carts`, {
        headers: {
          Accept: "application/json",
        },
      });
      console.log("刪除成功");
      getCart();
    } catch (error) {
      console.error("刪除失敗", error);
    } finally {
      setIsLoading(false);
    }
  };
  const updateProductToCart = async (cartProduct_id, cartProductCount) => {
    console.log("cartProduct_id", cartProduct_id, cartProductCount);
    setIsPartLoading(true);
    try {
      await axios.put(
        `${VITE_APP_API_BASE}/${VITE_APP_API_PATH}/cart/${cartProduct_id}`,
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
      const API_URL = `${VITE_APP_API_BASE}/${VITE_APP_API_PATH}/order`;
      await axios.post(API_URL, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log("訂單建立成功");
      getCart();
      reset();
    } catch (error) {
      console.error("訂單建立失敗", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container">
      <h1>Cart page</h1>
      <div className="text-end">
        <button
          className="btn btn-outline-danger"
          type="button"
          onClick={() => {
            deleteAllFromCart();
          }}
        >
          清空購物車
        </button>
      </div>
      <table className="table align-middle">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>品名</th>
            <th style={{ width: "150px" }}>數量/單位</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          {/* Cart rows here */}
          {cartInfos &&
            cartInfos?.carts?.map((cartProduct) => {
              {
                /* console.log("cartProduct", cartProduct); */
              }
              return (
                <tr key={cartProduct.product.id} className="">
                  <td>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => {
                        deleteOneFromCart(cartProduct.id);
                      }}
                    >
                      刪除
                    </button>
                  </td>
                  <td>
                    <img
                      src={cartProduct.product.imageUrl}
                      alt=""
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td>{cartProduct.product.title}</td>
                  <td style={{ width: "150px" }}>
                    {/* update cart */}
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          updateProductToCart(
                            cartProduct.id,
                            cartProduct.qty - 1
                          );
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
                        value={cartProduct.qty}
                        onChange={(e) => {
                          updateProductToCart(
                            cartProduct.id,
                            e.target.value * 1
                          );
                        }}
                        className="form-control"
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          updateProductToCart(
                            cartProduct.id,
                            cartProduct.qty + 1
                          );
                        }}
                      >
                        +
                      </button>
                    </div>
                    {cartProduct.product.unit}
                  </td>
                  <td>{cartProduct.total}</td>
                </tr>
              );
            })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              總計 {cartInfos.final_total}
            </td>
            <td className="text-end"></td>
          </tr>
          <tr>
            <td colSpan="3" className="text-end text-success">
              折扣價
            </td>
            <td className="text-end text-success"></td>
          </tr>
        </tfoot>
      </table>
      {/* order form */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          {/* email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              {...register("email", {
                required: "必填",
                // regx
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email 格式不正確",
                },
              })}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
            {/* <p className="text-danger">{errors?.email?.message}</p> */}
          </div>
          {/* name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="姓名"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              {...register("name", {
                required: "必填",
              })}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>
          {/* phone */}
          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="電話"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              {...register("tel", {
                required: "必填",
                pattern: {
                  value: /^\d{8,15}$/,
                  message: "電話號碼格式不正確",
                },
              })}
            />
            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
          </div>
          {/* address */}
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="地址"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              {...register("address", {
                required: "必填",
              })}
            />
            {errors.address && (
              <p className="text-danger">{errors.address.message}</p>
            )}
          </div>
          {/* comment */}
          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("comment")}
            ></textarea>
          </div>
          {/* submit btn */}
          <div className="text-end">
            <button type="submit" className="btn btn-danger align-items-center">
              送出訂單
              {isPartLoading && (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>
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
export default Cart;
