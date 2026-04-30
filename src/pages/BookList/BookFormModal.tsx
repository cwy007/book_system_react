import { Form, Input, Modal, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { useEffect } from "react";
import { createBook, updateBook, uploadCover, type Book, type BookPayload } from "../../interfaces";

interface Props {
  open: boolean;
  book?: Book;
  onClose: () => void;
  onSuccess: () => void;
}

function normalizeCoverUrl(url?: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

function BookFormModal({ open, book, onClose, onSuccess }: Props) {
  const [form] = Form.useForm<BookPayload>();
  const cover = Form.useWatch("cover", form);
  const isEdit = !!book;

  useEffect(() => {
    if (open) {
      if (book) {
        form.setFieldsValue({
          name: book.name,
          author: book.author,
          description: book.description,
          cover: book.cover,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, book, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit && book) {
        await updateBook(book.id, values);
        message.success("修改成功");
      } else {
        await createBook(values);
        message.success("新增成功");
      }
      onSuccess();
    } catch (e) {
      if (e instanceof Error) message.error(e.message);
    }
  };

  const customUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess: onUploaded, onError } = options;
    try {
      const url = await uploadCover(file as File);
      form.setFieldValue("cover", url);
      form.validateFields(["cover"]);
      message.success("上传成功");
      onUploaded?.({ url }, file as unknown as XMLHttpRequest);
    } catch (e) {
      const err = e instanceof Error ? e : new Error("上传失败");
      message.error(err.message);
      onError?.(err);
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "修改书籍" : "新增书籍"}
      okText={isEdit ? "修改" : "新增"}
      cancelText="取消"
      onOk={onOk}
      onCancel={onClose}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} autoComplete="off">
        <Form.Item label="名称" name="name" rules={[{ required: true, message: "请输入书名" }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="作者" name="author" rules={[{ required: true, message: "请输入作者" }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: "请输入描述" }]}
        >
          <Input.TextArea placeholder="请输入" rows={4} />
        </Form.Item>
        <Form.Item name="cover" hidden rules={[{ required: true, message: "请上传封面" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="封面">
          {cover ? (
            <img
              src={normalizeCoverUrl(cover)}
              alt="封面"
              style={{
                width: 120,
                height: 160,
                objectFit: "cover",
                borderRadius: 4,
                border: "1px solid #f0f0f0",
              }}
            />
          ) : null}
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Upload.Dragger
            name="file"
            multiple={false}
            showUploadList={false}
            accept="image/*"
            customRequest={customUpload}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到这个区域来上传</p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default BookFormModal;
