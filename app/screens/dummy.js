db.transaction(function (txn) {
    txn.executeSql(
        "SELECT * FROM sqlite_master WHERE type='table' AND name='certificate_table'",
        [],
        function (tx, res) {
            // console.log('item:', res.rows.length);
            if (res.rows.length == 0) {
                txn.executeSql('DROP TABLE IF EXISTS certificate_table', []);
                txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS certificate_table(certificate_id INTEGER PRIMARY KEY AUTOINCREMENT, student_ref INTEGER REFERENCES student_table(student_id), teacher_ref INTEGER REFERENCES teacher_table(teacher_id), certificate_name VARCHAR(30), certificate_uri VARCHAR(250), certificate_venue VARCHAR(30), certificate_days VARCHAR(10), certificate_date VARCHAR(50), certificate_type VARCHAR(50), certificate_subtype VARCHAR(50), certificate_status VARCHAR(10), certificate_points INTEGER(4))',
                    []
                );
            }
        }
    );
});
// console.log("----- Certificate Data------")
db.transaction((tx) => {
    tx.executeSql(
        'SELECT * FROM certificate_table',
        [],
        (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
                //console.log("reading: ", i);
                temp.push(results.rows.item(i));
            }
            //console.log(temp);
        }
    );
});