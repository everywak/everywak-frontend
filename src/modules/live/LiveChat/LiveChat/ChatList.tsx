import { ChatItem } from '../LiveChat.type';

import { Chat } from './ChatList/Chat';

import styles from './ChatList.module.scss';
import classNames from 'classnames/bind';
import { forwardRef, Ref, useEffect, useRef } from 'react';
import { ClickToScrollButton } from './ChatList/ClickToScrollButton';
import { motion } from 'framer-motion';
const cx = classNames.bind(styles);

export type Props = {
  className?: string;
  items: ChatItem[];
  autoScroll?: boolean;
  onTouchToBottom?: (touched: boolean) => void;
};
export function ChatList(props: Props) {
  const list = props.items.map((chatItem) => (
    <Chat key={chatItem.id} item={chatItem} />
  ));
  const thisRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  const scrollToBottom = () => {
    if (thisRef.current) {
      thisRef.current.scrollTop = thisRef.current.scrollHeight;
    }
  };

  const onScrollHandler: React.UIEventHandler<HTMLDivElement> = (
    e: React.UIEvent<HTMLDivElement, UIEvent>,
  ) => {
    const target = e.target as HTMLDivElement;

    const _touched =
      target.scrollTop + target.clientHeight > target.scrollHeight - 60;

    if (touched.current !== _touched) {
      touched.current = _touched;
      props.onTouchToBottom && props.onTouchToBottom(touched.current);
    }
  };

  useEffect(() => {
    if (props.autoScroll) {
      scrollToBottom();
      setTimeout(scrollToBottom, 1);
    }
  }, [props.autoScroll, props.items]);

  return (
    <div className={cx('ChatList', props.className, {hideScrollbar: props.autoScroll})}>
      <div
        className={styles.listWrapper}
        ref={thisRef as Ref<HTMLDivElement>}
        onScroll={onScrollHandler}
      >
        {list}
      </div>
      {!props.autoScroll && (
        <motion.div
          className={styles.scrollButton}
          initial={{
            bottom: '-32px',
          }}
          animate={{
            bottom: '8px',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 16,
            duration: 0.15,
          }}
        >
          <ClickToScrollButton onClick={scrollToBottom} />
        </motion.div>
      )}
    </div>
  );
}
