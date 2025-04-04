import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { Button } from 'common/components';
import styles from './OverlayOnChat.module.scss';

export interface Props {
  className?: string;
  autoScroll?: boolean;
  scrollToBottom: () => void;
  snackBarMessage: string;
}

export function OverlayOnChat(props: Props) {
  return (
    <div className={clsx(styles.container, props.className)}>
      <RisingUp
        isVisible={!props.autoScroll}
        height={40}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 16,
          duration: 0.15,
        }}
      >
        <ClickToScrollButton onClick={props.scrollToBottom} />
      </RisingUp>
      <RisingUp
        isVisible={props.snackBarMessage != ''}
        height={30}
        transition={{
          stiffness: 300,
          damping: 16,
          duration: 0.15,
        }}
      >
        <div className={styles.snackBar}>{props.snackBarMessage}</div>
      </RisingUp>
    </div>
  );
}

export function RisingUp({
  className,
  isVisible,
  height,
  transition,
  children,
}: {
  className?: string;
  isVisible: boolean;
  height: number;
  transition: any;
  children?: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={{
            height: 0,
          }}
          animate={{
            height,
          }}
          exit={{
            height: 0,
          }}
          transition={transition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ClickToScrollButton({
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  return (
    <Button className={styles.scrollButton} onClick={onClick}>
      클릭하여 스크롤
    </Button>
  );
}
