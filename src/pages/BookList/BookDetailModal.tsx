import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { getBook, type Book } from "../../interfaces";
import styles from "./index.module.css";

interface Props {
  open: boolean;
  bookId?: number;
  onClose: () => void;
}

function BookDetailModal({ open, bookId, onClose }: Props) {
  const [book, setBook] = useState<Book | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && bookId !== undefined) {
      setLoading(true);
      getBook(bookId)
        .then(setBook)
        .finally(() => setLoading(false));
    } else {
      setBook(undefined);
    }
  }, [open, bookId]);

  return (
    <Modal open={open} title="书籍详情" footer={null} onCancel={onClose} destroyOnHidden>
      {loading || !book ? (
        <Spin />
      ) : (
        <div>
          {book.cover && <img className={styles.detailCover} src={book.cover} alt={book.name} />}
          <div className={styles.detailItem}>
            <span className={styles.key}>名称：</span>
            <span>{book.name}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.key}>作者：</span>
            <span>{book.author}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.key}>描述：</span>
            <span>{book.description}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default BookDetailModal;
