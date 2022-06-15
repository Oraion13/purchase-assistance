<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Purchases.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Purchases_api extends Purchases
{
    private $Purchases;

    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for purchases to do operations
        $this->Purchases = new Purchases($db);
    }
    // Get all data
    public function get()
    {
        // Get the purchases from DB
        $all_data = $this->Purchases->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no purchases found');
            die();
        }
    }

    // Get all data of a purchases by ID
    public function get_by_id($id)
    {
        // Get the purchases from DB
        $this->Purchases->purchase_id = $id;
        $all_data = $this->Purchases->read_row();

        if ($all_data) {
            echo json_encode($all_data);
            die();
        } else {
            send(400, 'error', 'no purchases found');
            die();
        }
    }

    // Get all data of a purchases by date
    public function get_by_date($start, $end)
    {
        // Get the purchases from DB
        $from = date('Y-m-01', strtotime($start));
        $this->Purchases->start = $from;
        $to = date('Y-m-01', strtotime($end));
        $this->Purchases->end = $to;

        $all_data = $this->Purchases->read_row_date();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no purchases found');
            die();
        }
    }

    // POST a new purchases
    public function post()
    {
        // Get input data as json
        $data = json_decode(file_get_contents("php://input"));

        // Clean the data
        $this->Purchases->purchase_type = $data->purchase_type;
        
        $from = date('Y-m-01', strtotime($data->purchase_from));
        $this->Purchases->purchase_from = $from;
        $to = date('Y-m-01', strtotime($data->purchase_to));
        $this->Purchases->purchase_to = $to;

        $this->Purchases->department = $data->department;
        $this->Purchases->purchase_name = $data->purchase_name;
        $this->Purchases->purchase_purpose = $data->purchase_purpose;
        $this->Purchases->is_consumable = $data->is_consumable;
        $this->Purchases->is_below = $data->is_below;

        // Get the purchases from DB
        $all_data = $this->Purchases->read_single();

        // If no purchases exists
        if (!$all_data) {
            // If no purchases exists, insert and get_by_id the data
            if ($this->Purchases->post()) {
                $row = $this->Purchases->read_single();

                echo json_encode($row);
            } else {
                send(400, 'error', 'purchases cannot be created');
            }
        } else {
            send(400, 'error', 'purchases already exists');
        }
    }

    // UPDATE existing purchases
    public function update_by_id($DB_data, $to_update, $update_str)
    {
        if (strcmp($DB_data, $to_update) !== 0) {
            if (!$this->Purchases->update_row($update_str)) {
                // If can't update_by_id the data, throw an error message
                send(400, 'error', $update_str . ' cannot be updated');
                die();
            }
        }
    }

    // UPDATE (PUT) a existing user's info
    public function put()
    {
        // Get input data as json
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'pass a purchases id');
            die();
        }

        // Clean the data
        $this->Purchases->purchase_id = $_GET['ID']; // should pass the purchases id in URL
        
        $from = date('Y-m-01', strtotime($data->purchase_from));
        $this->Purchases->purchase_from = $from;
        $to = date('Y-m-01', strtotime($data->purchase_to));
        $this->Purchases->purchase_to = $to;

        $this->Purchases->purchase_type = $data->purchase_type;
        $this->Purchases->department = $data->department;
        $this->Purchases->purchase_name = $data->purchase_name;
        $this->Purchases->purchase_purpose = $data->purchase_purpose;
        $this->Purchases->is_consumable = $data->is_consumable;
        $this->Purchases->is_below = $data->is_below;

        // Get the purchases from DB
        $all_data = $this->Purchases->read_row();

        // If purchases already exists, update the purchases that changed
        if ($all_data) {
            $this->update_by_id($all_data['purchase_from'], $data->purchase_from, 'purchase_from');
            $this->update_by_id($all_data['purchase_to'], $data->purchase_to, 'purchase_to');
            $this->update_by_id($all_data['purchase_type'], $data->purchase_type, 'purchase_type');
            $this->update_by_id($all_data['department'], $data->department, 'department');
            $this->update_by_id($all_data['purchase_name'], $data->purchase_name, 'purchase_name');
            $this->update_by_id($all_data['purchase_purpose'], $data->purchase_purpose, 'purchase_purpose');
            $this->update_by_id($all_data['is_consumable'], $data->is_consumable, 'is_consumable');
            $this->update_by_id($all_data['is_below'], $data->is_below, 'is_below');

            // If updated successfully, get_by_id the data, else throw an error message 
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'no purchases found for ID: ' . $_GET['ID']);
        }
    }

    public function delete_by_id()
    {
        if (!isset($_GET['ID'])) {
            send(400, 'error', 'pass a purchases id');
            die();
        }
        $this->Purchases->purchase_id = $_GET['ID']; // should pass the purchases id in URL

        // Check for purchases existance
        $all_data = $this->Purchases->read_row();

        if(!$all_data){
            send(400, 'error', 'no purchases found for ID: ' . $_GET['ID']);
            die();
        }

        if ($this->Purchases->delete_row()) {
            send(200, 'message', 'purchases deleted successfully');
        } else {
            send(400, 'error', 'purchases cannot be deleted');
        }
    }
}


// GET all the purchases
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Purchases_api = new Purchases_api();
    if (isset($_GET['ID'])) {
        $Purchases_api->get_by_id($_GET['ID']);
    }
}

// To check if admin is logged in
loggedin();

// If a admin logged in ...

// GET all the purchases
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Purchases_api = new Purchases_api();
    if (isset($_GET['from']) && isset($_GET['to'])) {
        $Purchases_api->get_by_date($_GET['from'], $_GET['to']);
    } else {
        $Purchases_api->get();
    }
}

// POST a new purchases
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $Purchases_api = new Purchases_api();
    $Purchases_api->post();
}

// UPDATE (PUT) a existing purchases
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Purchases_api = new Purchases_api();
    $Purchases_api->put();
}

// DELETE a existing purchases
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Purchases_api = new Purchases_api();
    $Purchases_api->delete_by_id();
}
