import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { register, type UserPayload } from "../../interfaces";
import styles from "../Login/index.module.css";

interface SignupForm extends UserPayload {
  confirmPassword: string;
}

function Signup() {
  const navigate = useNavigate();

  const onFinish = async (values: SignupForm) => {
    try {
      const res = await register({
        username: values.username,
        password: values.password,
      });
      message.success(`注册成功：${res.username}`);
      navigate("/login");
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

        <Form.Item
          label="确认密码"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "请再次输入密码" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不一致"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请输入" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 18 }} className={styles.tip}>
          <Link to="/login">已有账号？去登录</Link>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="primary" htmlType="submit" className={styles.btn}>
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Signup;
