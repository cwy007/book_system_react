import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { login, type UserPayload } from "../interfaces";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();

  const onFinish = async (values: UserPayload) => {
    try {
      const res = await login(values);
      message.success(`登录成功，欢迎 ${res.username}`);
      navigate("/");
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>图书管理系统</h1>
      <Form
        className={styles.form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
          <Input.Password placeholder="请输入" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 18 }} className={styles.tip}>
          <Link to="/signup">没有账号？去注册</Link>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="primary" htmlType="submit" className={styles.btn}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
