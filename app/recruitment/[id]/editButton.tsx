type props = {
  id: number;
};

const EditButton = ({ id }: props) => {
  return (
    <div>
      <button>内容を編集する</button>
    </div>
  );
};

export default EditButton;
