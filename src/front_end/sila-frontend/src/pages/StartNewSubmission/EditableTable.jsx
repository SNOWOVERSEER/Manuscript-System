import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';

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
      // Delay focus slightly to ensure it works in complex scenarios
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    console.log(`Editing ${dataIndex}: ${record[dataIndex]}`);
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
      console.log("Saved", values);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
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
  const handleDelete = (key) => {
    const newData = dataSource.filter(item => item.key !== key);
    setDataSource(newData);
  };

  const handleAdd = () => {
    const newKey = dataSource.length > 0 ? parseInt(dataSource[dataSource.length - 1].key) + 1 : 0;
    const newData = {
      key: newKey.toString(),
      firstName: 'N/A',  
      lastName: 'N/A',
      affiliation: 'N/A',
      academicTitle: 'N/A',
      orcid: 'N/A',
    };
    setDataSource([...dataSource, newData]);
    console.log("Added new row", newData);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
    console.log("Data after save", newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = [
    { title: 'First Name', dataIndex: 'firstName', editable: true },
    { title: 'Last Name', dataIndex: 'lastName', editable: true },
    { title: 'Affiliation', dataIndex: 'affiliation', editable: true },
    { title: 'Academic Title', dataIndex: 'academicTitle', editable: true },
    { title: 'ORCID', dataIndex: 'orcid', editable: true },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ].map(col => ({
    ...col,
    onCell: record => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }));

  return (
    <div style={{width: '67%', margin: 'auto', marginTop: '30px', marginBottom: '30px'}}>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey={record => record.key} 
        pagination={false} 
      />
      <Button onClick={handleAdd} type="primary" style={{ marginTop: 16 }}>
        Add a Row
      </Button>
    </div>
  );
};

export default CustomTable;
