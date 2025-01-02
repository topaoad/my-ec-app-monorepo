type Props = {
  text: string;
};

const SnapshotComponent: React.FC<Props> = ({ text }) => {
  return (
    <div>
      <p>{text}</p>
    </div>
  );
};

export default SnapshotComponent;
