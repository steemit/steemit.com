import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CloseButton from 'react-foundation-components/lib/global/close-button';
import Reveal from 'react-foundation-components/lib/global/reveal';
import g from 'app/redux/GlobalReducer';
import { Map, List } from 'immutable';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import QrReader from 'app/components/elements/QrReader';
import ConvertToSteem from 'app/components/elements/ConvertToSteem';
//import SuggestPassword from 'app/components/elements/SuggestPassword';
import ChangePassword from 'app/components/elements/ChangePassword';
import CheckLoginOwner from 'app/components/elements/CheckLoginOwner';
import QrKeyView from 'app/components/elements/QrKeyView';
import PromotePost from 'app/components/modules/PromotePost';
import ExplorePost from 'app/components/modules/ExplorePost';
import DelegateVestingShares from 'app/components/modules/DelegateVestingShares';
import DelegateVestingSharesInfo from 'app/components/modules/DelegateVestingSharesInfo';

class Dialogs extends React.Component {
    static propTypes = {
        active_dialogs: PropTypes.object,
        hide: PropTypes.func.isRequired,
    };

    constructor() {
        super();
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Dialogs');
        this.hide = name => {
            this.props.hide(name);
        };
    }

    componentWillReceiveProps(nextProps) {
        const { active_dialogs, hide } = nextProps;
        active_dialogs.forEach((v, k) => {
            if (!this['hide_' + k]) this['hide_' + k] = () => hide(k);
        });
    }

    render() {
        const { active_dialogs } = this.props;
        let idx = 0;

        const dialogs = [];

        active_dialogs.forEach((k, v) => {
            if (k === 'promotePost') {
                dialogs.push(
                    <span key={idx++}>
                        <Reveal onHide={this['hide_' + k]} show>
                            <CloseButton onClick={this['hide_' + k]} />
                            <PromotePost onClose={this['hide_' + k]} {...v.get('params').toJS()} />
                        </Reveal>
                    </span>
                );
            } else if (k === 'explorePost') {
                dialogs.push(
                    <span key={idx++}>
                        <Reveal onHide={this['hide_' + k]} show>
                            <CloseButton onClick={this['hide_' + k]} />
                            <ExplorePost onClick={this['hide_' + k]} {...v.get('params').toJS()} />
                        </Reveal>
                    </span>
                );
            }
        });

        return (
            <div>
                {dialogs}
                <CheckLoginOwner />
            </div>
        );
    }
}

const emptyMap = Map();

export default connect(
    state => {
        return {
            active_dialogs: state.global.get('active_dialogs') || emptyMap,
        };
    },
    dispatch => ({
        hide: name => {
            dispatch(g.actions.hideDialog({ name }));
        },
    })
)(Dialogs);
