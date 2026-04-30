import { Button, Input, Modal, Space, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { deleteBook, listBooks, type Book } from "../../interfaces";
import BookDetailModal from "./BookDetailModal";
import BookFormModal from "./BookFormModal";
import styles from "./index.module.css";

function BookList() {
  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Book | undefined>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | undefined>();

  const fetchList = useCallback(async (name?: string) => {
    try {
      const data = await listBooks(name);
      setBooks(data);
    } catch (e) {
      if (e instanceof Error) message.error(e.message);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const onSearch = () => fetchList(keyword);

  const onCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const onEdit = (book: Book) => {
    setEditing(book);
    setFormOpen(true);
  };

  const onDetail = (book: Book) => {
    setDetailId(book.id);
    setDetailOpen(true);
  };

  const onDelete = (book: Book) => {
    Modal.confirm({
      title: "确认删除？",
      content: `删除后无法恢复：《${book.name}》`,
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deleteBook(book.id);
          message.success("删除成功");
          fetchList(keyword);
        } catch (e) {
          if (e instanceof Error) message.error(e.message);
        }
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>图书管理系统</h1>
      </div>
      <div className={styles.toolbar}>
        <span className={styles.label}>书籍名称</span>
        <Input
          style={{ width: 200 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={onSearch}
        />
        <Button type="primary" onClick={onSearch}>
          搜索图书
        </Button>
        <Button
          type="primary"
          style={{ background: "#52c41a", borderColor: "#52c41a" }}
          onClick={onCreate}
        >
          新增图书
        </Button>
      </div>

      <div className={styles.grid}>
        {books.map((book) => (
          <div key={book.id} className={styles.card}>
            <img className={styles.cover} src={book.cover} alt={book.name} />
            <div className={styles.bookName}>{book.name}</div>
            <div className={styles.author}>{book.author}</div>
            <Space className={styles.actions}>
              <a onClick={() => onDetail(book)}>详情</a>
              <a onClick={() => onEdit(book)}>更新</a>
              <a onClick={() => onDelete(book)}>删除</a>
            </Space>
          </div>
        ))}
      </div>

      <BookFormModal
        open={formOpen}
        book={editing}
        onClose={() => setFormOpen(false)}
        onSuccess={() => {
          setFormOpen(false);
          fetchList(keyword);
        }}
      />
      <BookDetailModal open={detailOpen} bookId={detailId} onClose={() => setDetailOpen(false)} />
    </div>
  );
}

export default BookList;
