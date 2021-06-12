"use strict";
const { Table, Tag, Space, Button, Select, Modal, Radio, Divider, Input, Checkbox} = antd;
const { Option } = Select;

const CurrentTime = () => {
    const useState = React.useState;
    const [ state, setState ] = useState(new Date().toString());
    const time = () => {
        return setState(new Date().toString());
    }
    setInterval(time, 1000);
    return React.createElement("div", null, "Current Time: " + state);
}

const User = () => {
    const user = sessionStorage.getItem('user')
    let validTime = 0;
    $.ajax({
        url: 'data/user.json',
        async: false,
        dataType: 'json',
        success : function(data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i]['name'] == user) {
                    validTime = data[i]['expire'];
                }
            }
        }
    });
    return React.createElement(Space, {size: "middle"},
        React.createElement("div", null, "Welcome, " + user),
        React.createElement("div", null, "Your Validity: "
        + parseInt((validTime / 10000).toString())
        + "-" + parseInt((validTime % 10000 / 100).toString())
        + "-" + parseInt((validTime % 100).toString())));
}

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
};

const MainTable = (data) => {
    data['length'] = Object.keys(data).length;
    let dataArray = Array.from(data);
    return (React.createElement("div", null,
        React.createElement(Divider, null),
        React.createElement(Table, { rowSelection: Object.assign({ type: "checkbox" }, rowSelection), columns: columns, dataSource: dataArray })));
};

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text) => React.createElement("a", null, text)
    },
    {
        title: "Subject",
        key: "subject",
        dataIndex: "subject",
        render: (subject) => (React.createElement(React.Fragment, null, subject.map((sub) => {
            let color;
            if (sub === "English") {
                color = "blue";
            }
            if (sub === "Olympic Math") {
                color = "red"
            }
            if (sub === "Calligraphy") {
                color = "green"
            }
            if (sub === "Writing") {
                color = "orange"
            }
            return (React.createElement(Tag, { color: color, key: sub }, sub));
        })))
    },
    {
        title: "Remaining Lessons",
        dataIndex: "remaining",
        key: "remaining lessons"
    },
    {
        title: "Used Lessons",
        dataIndex: "used",
        key: "used lessons"
    },
    {
        title: "Total Lessons",
        dataIndex: "total",
        key: "total lessons"
    },
    {
        title: "Action",
        key: "action",
        render: (text, record) => (React.createElement(Space, { size: "middle" },
            React.createElement(Button, { type: "primary" }, "Sign In"),
            React.createElement(Button, null, "Modify")))
    }
];

const ModalButton = () => {
    const useState = React.useState;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    let subject = '';
    const handleOk = () => {
        $.ajax({
            url: 'data/chen/student.json',
            async: false,
            dataType: 'json',
            success: function(data) {
                console.log(data);
                let name = $('#newStudentName').val();
                let lesson = $('#newStudentTotalLessons').val();
                console.log(name);
                console.log(subject);
                console.log(lesson);
            }});
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    function handleChange(value) {
        subject = value;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { type: "primary", onClick: showModal }, "Add.."),
        React.createElement(Modal, { title: "Add Student", visible: isModalVisible, onOk: handleOk, width: 312,
                onCancel: handleCancel, destroyOnClose: true },
            React.createElement(Space, { direction: "vertical" },
                React.createElement(Input, { placeholder: "Name", id: "newStudentName" }),
                React.createElement(Checkbox.Group, { name: "newStudentSubject", onChange: handleChange },
                    React.createElement(Space, { direction: "vertical" },
                        React.createElement(Checkbox, { value: "English" }, "English"),
                        React.createElement(Checkbox, { value: "Olympic Math" }, "Olympic Math"),
                        React.createElement(Checkbox, { value: "Calligraphy" }, "Calligraphy"),
                        React.createElement(Checkbox, { value: "Writing" }, "Writing"))),
                React.createElement(Input, { type: "number", placeholder: "Total Lessons",
                    id: "newStudentTotalLessons" })
            ))));
};

$(document).ready(function() {
    if (!sessionStorage.getItem('user')){
        $(location).attr('href', 'index.html');
        alert('Without Login!');
    } else {
        ReactDOM.render(React.createElement(Space, { size: "middle" },
            React.createElement(CurrentTime, null), React.createElement(User, null)),
            document.getElementById('userState')
        );

        $.getJSON('data/chen/student.json', function(data) {
            ReactDOM.render(React.createElement(MainTable, data),
                document.getElementById('mainTable'));
        });

        let dataSource = [];
        function handleChange(value) {
            $.getJSON('data/chen/student.json', function(data) {
                if (value == 'All') {
                    dataSource = data;
                } else {
                    let filteredData = [];
                    for (let i=0;i<data.length;i++) {
                        if ($.inArray(value, data[i]['subject']) > -1) {
                            filteredData.push(data[i]);
                        }
                    }
                    dataSource = filteredData;
                }
                ReactDOM.render(React.createElement(Table, { rowSelection: Object.assign({ type: "checkbox" },
                        rowSelection), columns: columns, dataSource: dataSource }),
                    document.getElementById('mainTable'));
            });
        }

        ReactDOM.render(React.createElement(Space, { size: "middle" },
            React.createElement("h3", null, "Subject:"),
            React.createElement(Select, { defaultValue: "All", style: { width: 120 }, onChange: handleChange },
                React.createElement(Option, { value: "All" }, "All"),
                React.createElement(Option, { value: "English" }, "English"),
                React.createElement(Option, { value: "Olympic Math" }, "Olympic Math"),
                React.createElement(Option, { value: "Calligraphy" }, "Calligraphy"),
                React.createElement(Option, { value: "Writing" }, "Writing"))),
            document.getElementById('subjectList'));

        ReactDOM.render(React.createElement(Space, { size: "middle" },
            React.createElement(ModalButton),
            React.createElement(Button, { id: "delStudent" }, "Delete")),
            document.getElementById('actionButton'));
    }
});
