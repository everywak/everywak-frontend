import clsx from 'clsx';
import { CloseRounded, DownloadRounded, UploadRounded } from '@mui/icons-material';
import { Button, Dropdown } from 'common/components';
import { useInputs } from 'hooks/useInputs';
import {
  ChatFilter,
  ChatFilterTarget,
  ChatFilterTargetName,
} from 'components/withlive/LiveChat/LiveChat.type';
import {
  useLiveChatActions,
  useLiveChatValue,
} from 'components/withlive/LiveChat/LiveChat.context';

import styles from './CollectorCustomInput.module.scss';

export interface Props {
  className?: string;
}

export const CollectorCustomInput = (props: Props) => {
  const { collectorOption } = useLiveChatValue();
  const { addChatFilter, removeChatFilter, importChatFilter, exportChatFilter } =
    useLiveChatActions();

  const [form, onChange] = useInputs({
    target: 'userId' as ChatFilterTarget,
    keyword: '',
  });

  const submit = (filter: 'include' | 'exclude') => {
    if (form.keyword === '') return;

    const newFilter: ChatFilter = {
      target: form.target,
      keyword: form.keyword,
      type: filter,
    };
    addChatFilter(newFilter);
    onChange({
      target: {
        name: 'keyword',
        value: '',
      },
    });
  };

  const filterList = collectorOption.customFilters.map((filter, i) => {
    return <FilterItem key={i} filter={filter} onRemove={removeChatFilter} />;
  });

  return (
    <div className={clsx('CollectorCustomInput', styles.container, props.className)}>
      <div className={styles.inputField}>
        <Dropdown
          className={styles.target}
          name="target"
          options={Object.entries(ChatFilterTargetName).map(([value, key]) => ({
            name: key,
            value: value,
          }))}
          onChange={onChange}
          value={form.target}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="키워드 입력"
          name="keyword"
          value={form.keyword}
          onChange={onChange}
        />
        <div className={styles.buttons}>
          <Button color="primary" onClick={() => submit('include')}>
            포함
          </Button>
          <Button color="secondary" onClick={() => submit('exclude')}>
            제외
          </Button>
        </div>
      </div>
      <div className={styles.export}>
        <Button color="primary" outlined onClick={importChatFilter}>
          <UploadRounded />
          필터 가져오기
        </Button>
        <Button color="primary" outlined onClick={exportChatFilter}>
          <DownloadRounded />
          필터 내보내기
        </Button>
      </div>
      <ul className={styles.list}>{filterList}</ul>
    </div>
  );
};

export const FilterItem = ({
  filter,
  onRemove,
}: {
  filter: ChatFilter;
  onRemove: (target: ChatFilter) => void;
}) => {
  return (
    <li className={styles.filterItem}>
      <div className={styles.target}>{ChatFilterTargetName[filter.target]}</div>
      <div className={styles.keyword}>{filter.keyword}</div>
      <div className={styles.filter}>{filter.type === 'include' ? '포함' : '제외'}</div>
      <Button
        className={styles.remove}
        color="primary"
        outlined
        size="small"
        onClick={() => onRemove(filter)}
      >
        <CloseRounded />
      </Button>
    </li>
  );
};
