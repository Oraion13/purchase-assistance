<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Files.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Proceedings_api extends Files
{
    private $Proceedings;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for proceedings table to do operations
        $this->Proceedings = new Files($db);

        // Set table name
        $this->Proceedings->table = 'purchase_proceedings';

        // Set column names
        $this->Proceedings->id_name = 'proceedings_id';
        $this->Proceedings->col_name = 'proceedings_name';
        $this->Proceedings->col_type = 'proceedings_type';
        $this->Proceedings->col = 'proceedings';
        $this->Proceedings->col_date = 'proceedings_date';
    }

    // Get all data
    public function get()
    {
        // Get the info from DB
        $all_data = $this->Proceedings->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['proceedings'] = base64_encode($row['proceedings']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about proceedings found');
            die();
        }
    }

    // Get all the data of proceedings
    public function get_by_id($id)
    {
        // Get the info from DB
        $this->Proceedings->purchase_id = $id;
        $all_data = $this->Proceedings->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['proceedings'] = base64_encode($row['proceedings']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about proceedings found');
            die();
        }
    }

    // POST a new file
    public function post()
    {
        if ($_FILES['proceedings']['size'] >= 1572864) {
            send(400, "error", "file size must be less than 1.5MB");
            die();
        }

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Proceedings->purchase_id = $_GET['ID'];
        $this->Proceedings->col_name_value = $_FILES['proceedings']['name'];
        $this->Proceedings->col_type_value = $_FILES['proceedings']['type'];
        $this->Proceedings->col_value = file_get_contents($_FILES['proceedings']['tmp_name']);
        $this->Proceedings->col_date_value=$_POST['proceedings_date'];

        if ($this->Proceedings->post()) {
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'proceedings file cannot be uploaded');
        }
    }

    // Delete a file
    public function delete_by_id()
    {
        if (!isset($_GET['ID'])) {
            send(400, "error", "provide an ID");
            die();
        }

        $this->Proceedings->id = $_GET['ID'];
        if ($this->Proceedings->delete_row()) {
            send(200, 'message', 'proceedings file successfully');
        } else {
            send(400, 'error', 'proceedings file cannot deleted');
        }
    }
}



// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Proceedings_api = new Proceedings_api();
    if (isset($_GET['ID'])) {
        $Proceedings_api->get_by_id($_GET['ID']);
    }else {
        $Proceedings_api->get();
    }
}

// To check if admin is logged in
loggedin();

// If admin logged in ...

// POST a new file
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Proceedings_api = new Proceedings_api();
    $Proceedings_api->post();
}

// DELETE a file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Proceedings_api = new Proceedings_api();
    $Proceedings_api->delete_by_id();
}
