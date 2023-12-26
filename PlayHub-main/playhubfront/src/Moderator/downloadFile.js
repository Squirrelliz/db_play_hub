import axios from "axios";
import {utils, writeFile} from "xlsx";
import {jsPDF} from "jspdf";
import autoTable from "jspdf-autotable";
import {Button, ButtonGroup, Dropdown, DropdownButton} from "react-bootstrap";
import { saveAs } from 'file-saver';

export default function DownloadFile({curUrl}) {
    const downloadAll = async (type) => {
        try {
            const response = await axios.get(`http://localhost:8000/${curUrl}/?limit=1000000&offset=0`);
            console.log(response)
            if (response.status === 200) {
                if (curUrl === 'sports') {
                    switch (type) {
                        case 'xlsx':
                            downloadExel(response.data);
                            break;
                        case 'pdf':
                            downloadPDF(response.data);
                            break;
                        case 'json':
                            downloadJSON(response.data);
                            break;
                        case 'csv':
                            downloadCSV(response.data);
                            break;
                        default:
                    }
                } else if (curUrl === 'players') {
                    switch (type) {
                        case 'xlsx':
                            downloadExel(response.data.data);
                            break;
                        case 'pdf':
                            downloadPDF(response.data.data);
                            break;
                        case 'json':
                            downloadJSON(response.data.data);
                            break;
                        case 'csv':
                            downloadCSV(response.data.data);
                            break;
                        default:
                    }
                } else {
                    switch (type) {
                        case 'json':
                            downloadJSON(response.data);
                            break;
                        default:
                    }
                }
            } else {
                console.error('Ошибка при запросе данных о наградах');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };
    const downloadExel = (data) => {
        let wb = utils.book_new(),
            ws = utils.json_to_sheet(data);
        utils.book_append_sheet(wb, ws, "MySheet1");
        writeFile(wb, `${curUrl}.xlsx`);
    }
    const downloadPDF = (data) => {
        const head = Object.keys(data[0]);
        const body = data.map(item => Object.values(item));

        const formattedData = {
            head: [head],
            body: body,
        };
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
            putOnlyUsedFonts: true,
            floatPrecision: 16,
            encoding: "utf8"
        });
        doc.setFont("helvetica");
        autoTable(doc, formattedData);
        doc.save(`${curUrl}.pdf`);
    }
    const downloadJSON = (data) => {
        const jsonContent = JSON.stringify(data);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        saveAs(blob, `${curUrl}.json`);
    };

    const downloadCSV = (data) => {
        const csvContent = "\uFEFF" + data.map(row => Object.values(row).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `${curUrl}.csv`);
    };

    return (
        curUrl === 'players' || curUrl === 'sports'
        ? (<DropdownButton as={ButtonGroup} title={"Выгрузить данные"} id="dropdown-primary" className="m-lg-2">
                    <Dropdown.Item onClick={() => downloadAll('xlsx')}>.XLSX</Dropdown.Item>
                    <Dropdown.Item onClick={() => downloadAll('json')}>.JSON</Dropdown.Item>
                    <Dropdown.Item onClick={() => downloadAll('csv')}>.CSV</Dropdown.Item>
                    <Dropdown.Item onClick={() => downloadAll('pdf')}>.PDF</Dropdown.Item>
                </DropdownButton>)
        : (<DropdownButton as={ButtonGroup} title={"Выгрузить данные"} id="dropdown-primary" className="m-lg-2">
                <Dropdown.Item onClick={() => downloadAll('json')}>.JSON</Dropdown.Item>
            </DropdownButton>));
}