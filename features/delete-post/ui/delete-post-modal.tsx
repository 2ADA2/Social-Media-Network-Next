import { useTranslations } from "next-intl";
import { Modal } from "@/shared/ui/modal";
import { StyledTitle } from "@/features/create-post/create-post-modal/create-post-modal.styles";
import { Button } from "@/shared/ui/button";
import "./delete-post-modal.css";

export interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isPending: boolean;
}

export const DeletePostModal = ({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: DeletePostModalProps) => {
  const t = useTranslations("main");

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="delete-post-modal">
      <StyledTitle>{t("deletePost.title")}</StyledTitle>
      <p>{t("deletePost.text")}</p>
      <div className="buttons-container">
        <Button disabled={isPending} onClick={onClose}>
          {t("deletePost.cancel")}
        </Button>
        <Button disabled={isPending} onClick={handleSubmit}>
          {t("deletePost.submit")}
        </Button>
      </div>
    </Modal>
  );
};
