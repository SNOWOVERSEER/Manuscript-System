import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Checkbox, Form, Input, Popconfirm, Table } from "antd";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const CustomTable = ({ dataSource, setDataSource }) => {
  const authorTitles = [
    "First Author",
    "Second Author",
    "Third Author",
    "Fourth Author",
    "Fifth Author",
    "Sixth Author",
    "Seventh Author",
    "Eighth Author",
  ];

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleAdd = () => {
    if (dataSource.length >= 8) {
      console.log("Maximum number of rows reached");
      return;
    }
    const newKey = dataSource.length + 1;
    const newData = {
      key: newKey.toString(),
      authorOrder: `Author ${newKey}`, // Not displayed, index-based
      firstName: "N/A",
      lastName: "N/A",
      affiliation: "N/A",
      academicTitle: "N/A",
      orcid: "N/A",
      isCorresponding: false,
    };
    setDataSource([...dataSource, newData]);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === row.key);
    if (index > -1) {
      const item = newData[index];
      newData[index] = { ...item, ...row };
      setDataSource(newData);
      console.log("Data after save", newData);
    } else {
      console.log("Item not found when trying to save");
    }
  };

  // checkbox for corresponding author
  const handleCorrespondingChange = (e, key) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === key);
    if (index > -1) {
      const item = newData[index];
      item.isCorresponding = e.target.checked;
      setDataSource(newData);
      console.log("Updated Corresponding Status", newData);
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = [
    {
      title: "Author Order",
      dataIndex: "authorOrder",
      key: "authorOrder",
      width: 100,
      render: (_, __, index) => authorTitles[index] || "Additional Author",
    },
    { title: "First Name", dataIndex: "firstName", editable: true },
    { title: "Last Name", dataIndex: "lastName", editable: true },
    { title: "Affiliation", dataIndex: "affiliation", editable: true },
    { title: "Academic Title", dataIndex: "academicTitle", editable: true },
    { title: "ORCID", dataIndex: "orcid", editable: true },
    {
      title: "Corresponding?",
      dataIndex: "isCorresponding",
      key: "isCorresponding",
      render: (text, record) => (
        <Checkbox
          checked={record.isCorresponding}
          onChange={(e) => handleCorrespondingChange(e, record.key)}
        />
      ),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ].map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }));

  return (
    <div
      style={{
        width: "67%",
        margin: "auto",
        marginTop: "30px",
        marginBottom: "30px",
      }}
    >
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => record.key}
        pagination={false}
      />
      <Button onClick={handleAdd} type="primary" style={{ marginTop: 16 }}>
        Add a Row
      </Button>
    </div>
  );
};

export default CustomTable;
