import { Ref, useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Chat, OverlayOnChat } from './components';
import { ChatItem, ChatOption } from '../../LiveChat.type';
import styles from './ChatList.module.scss';

export interface Props {
  className?: string;
  items: ChatItem[];
  snackBarMessage: string;
  autoScroll?: boolean;
  onTouchToBottom?: (touched: boolean) => void;
  options: ChatOption;
  isDarkMode?: boolean;
}

export const ChatList = (props: Props) => {
  const thisRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (thisRef.current) {
      thisRef.current.scrollTop = thisRef.current.scrollHeight;
    }
  }, [thisRef]);

  const onScrollHandler: React.UIEventHandler<HTMLDivElement> = (
    e: React.UIEvent<HTMLDivElement, UIEvent>,
  ) => {
    const target = e.target as HTMLDivElement;

    const _touched = target.scrollTop + target.clientHeight > target.scrollHeight - 60;

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

  const renderChat = useCallback(
    (chatItem: ChatItem) => (
      <Chat
        key={chatItem.id}
        item={chatItem}
        options={props.options}
        isDarkMode={props.isDarkMode}
      />
    ),
    [JSON.stringify(props.options), props.isDarkMode],
  );

  const list = props.items.map(renderChat);

  return (
    <div
      className={clsx(styles.container, props.className, {
        hideScrollbar: props.autoScroll,
      })}
    >
      <div
        className={styles.listWrapper}
        ref={thisRef as Ref<HTMLDivElement>}
        onScroll={onScrollHandler}
      >
        {list}
      </div>
      <OverlayOnChat
        autoScroll={props.autoScroll}
        scrollToBottom={scrollToBottom}
        snackBarMessage={props.snackBarMessage}
      />
    </div>
  );
};
