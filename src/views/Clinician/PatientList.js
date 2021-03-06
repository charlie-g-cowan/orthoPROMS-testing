import React from 'react';
import HeaderMenu from "../../components/HeaderMenu";
import PatientListEntry from "../../components/Clinician/PatientListEntry";
import getAllEHRsInCDR from "../../components/Queries/getAllEHRsInCDR";
import NHSContainer from "../../components/react-styled-nhs/src/NHSContainer";
import NHSWrapper from "../../components/react-styled-nhs/src/NHSWrapper";
import { NHSTable, NHSTBody, NHSTh, NHSTHead, NHSTr } from "../../components/react-styled-nhs/src/NHSTableWrapperTest";
import { connect } from 'react-redux'
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { handleCliniSearch, setPatientList } from '../../actions/clinicianActions'
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css'
import * as PropTypes from "prop-types";

class PatientListtable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            patientList: []
        };
        this.handlePageChange = (e) => {
            let { patientListFiltered } = this.props;
            this.setState({
                page: e,
                patientList: e >= 1 ? patientListFiltered.slice((e - 1) * 10, e * 10) : patientListFiltered.slice(0, 10)
            })
        };
    }

    componentDidMount() {
        let promise = getAllEHRsInCDR();
        promise.then((e) => {
            this.props.setPatientList(e);
            this.setState({ ehrs: e });
        });
    }

    componentWillReceiveProps(nextProps) {
        let patientLists = nextProps.patientListFiltered;
        this.setState({
            patientList: (patientLists || []).slice(0, 10)
        })
    }

    render() {
        let { patientListFiltered } = this.props
        let { patientList } = this.state;
        if ((patientListFiltered || []).length > 0) {
            return <>
                <NHSTable> <NHSTHead> <NHSTr> <NHSTh>#</NHSTh> <NHSTh>NHS Number</NHSTh> <NHSTh>Gender</NHSTh>
                    <NHSTh>Sex</NHSTh> <NHSTh>Vital Status</NHSTh> <NHSTh>Birth
                        Year</NHSTh> {/* <th>Time created</th> */}
                </NHSTr> </NHSTHead> <NHSTBody>
                    {patientList.map((e, index) => {
                        e.id = index + 1;
                        return PatientListEntry(e);
                    })}
                </NHSTBody> </NHSTable> <Pagination current={this.state.page} total={patientListFiltered.length}
                                                    onChange={this.handlePageChange.bind(this)}></Pagination>
            </>
        } else {
            return (
                <div>
                    <Alert key="warning" variant="warning" className="text-left"> No patients were found </Alert>
                </div>
            )
        }
    }
}

PatientListtable.propTypes = {
    patientListFiltered: PropTypes.array,
    setPatientList: PropTypes.func,
};

const PatientListTable = connect(
    state => {
        return {
            patientListFiltered: state.clinician.patientListFiltered,
        }
    },
    {
        setPatientList
    }
)(PatientListtable);

class PatientList extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = e => {
            this.props.handleCliniSearch(e.target.value)
        };
    }

    render() {
        let { search } = this.props;
        return (
            <div style={{ fontFamily: 'Arial, Sans-serif' }}>
                <HeaderMenu/> <NHSContainer> <NHSWrapper>
                <h1>Patient List<Form inline style={{ 'float': 'right' }}> <FormControl type="text" placeholder="Search"
                                                                                        value={search}
                                                                                        onChange={this.onChange}
                                                                                        className="mr-sm-2"/> </Form>
                </h1>
                <PatientListTable/> </NHSWrapper> </NHSContainer>
            </div>
        );
    }
}

PatientList.propTypes = {
    handleCliniSearch: PropTypes.func,
    search: PropTypes.string
};

export default connect(
    state => {
        return {
            search: state.clinician.search
        }
    },
    {
        handleCliniSearch
    }
)(PatientList)
