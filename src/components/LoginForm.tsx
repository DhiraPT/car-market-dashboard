import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import supabase from "../utils/supabase";
import { useState } from "react";
import { Content } from "antd/es/layout/layout";

type FieldType = {
  password?: string;
};

const LoginForm = () => {
  const [form] = Form.useForm<FieldType>();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_EMAIL,
      password: values.password!,
    });
    if (error) {
      form.setFields([{ name: "password", errors: [error.message] }]);
    }
    setLoading(false);
  };

  return (
    <Content className="content">
      <Form
        form={form}
        name="login-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        className="login-form"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" disabled={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default LoginForm;
