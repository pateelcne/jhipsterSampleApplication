import * as React from 'react';
import { connect } from 'react-redux';
import { Alert, Table, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { getSession } from 'app/shared/reducers/authentication';
import { IRootState } from 'app/shared/reducers';
import { findAll, invalidateSession } from './sessions.reducer';

export interface ISessionsProps extends StateProps, DispatchProps {}

export class SessionsPage extends React.Component<ISessionsProps> {
  componentDidMount() {
    this.props.getSession();
    this.props.findAll();
  }

  doSessionInvalidation = series => () => {
    this.props.invalidateSession(series);
    this.props.findAll();
  };

  refreshList = () => {
    this.props.findAll();
  };

  render() {
    const { account, sessions, updateSuccess, updateFailure } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="sessions.title" interpolate={{ username: account.login }}>
            Active sessions for [<b>{account.login}</b>]
          </Translate>
        </h2>

        {updateSuccess ? (
          <Alert color="success">
            <Translate contentKey="sessions.messages.success">
              <strong>Session invalidated!</strong>
            </Translate>
          </Alert>
        ) : null}

        {updateFailure ? (
          <Alert color="danger">
            <Translate contentKey="sessions.messages.error">
              <span>
                <strong>An error has occured!</strong> The session could not be invalidated.
              </span>
            </Translate>
          </Alert>
        ) : null}

        <Button color="primary" onClick={this.refreshList}>
          Refresh
        </Button>

        <div className="table-responsive">
          <Table className="table-striped">
            <thead>
              <tr>
                <th>
                  <Translate contentKey="sessions.table.ipaddress">IP Address</Translate>
                </th>
                <th>
                  <Translate contentKey="sessions.table.useragent">User agent</Translate>
                </th>
                <th>
                  <Translate contentKey="sessions.table.date">Date</Translate>
                </th>
                <th />
              </tr>
            </thead>

            <tbody>
              {sessions.map(s => (
                <tr>
                  <td>{s.ipAddress}</td>
                  <td>{s.userAgent}</td>
                  <td>{s.tokenDate}</td>
                  <td>
                    <Button color="primary" onClick={this.doSessionInvalidation(s.series)}>
                      <Translate contentKey="sessions.table.button">Invalidate</Translate>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ authentication, sessions }: IRootState) => ({
  account: authentication.account,
  sessions: sessions.sessions,
  updateSuccess: sessions.updateSuccess,
  updateFailure: sessions.updateFailure
});

const mapDispatchToProps = { getSession, findAll, invalidateSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SessionsPage);
