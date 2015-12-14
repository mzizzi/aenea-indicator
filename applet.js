/**
 * Places a small microphone icon in a panel.  Icon color can be changed via
 * dbus method calls. e.g:
 *
 * dbus-send \
 *   --type=method_call \
 *   --print-reply \
 *   --dest=com.mhzizzi.AeneaIndicator.Interface \
 *   /com/mhzizzi/AeneaIndicator/Interface \
 *   com.mhzizzi.AeneaIndicator.Interface.SetAppletIcon \
 *   string:green
 *
 * Valid args are: string:green | string:red | string:yellow | string:idk
 *
 * Typical usage involves hooking into natlink with the aenea client to receive
 * mic state changes and send them to the server.
 *
 * Tested with Linux Mint 17
 */

const Applet = imports.ui.applet;
const Util = imports.misc.util;
const Gio = imports.gi.Gio;

const INTERFACE_NAME = 'com.mhzizzi.AeneaIndicator.Interface';
const INTERFACE_PATH = '/com/mhzizzi/AeneaIndicator/Interface';

const AeneaIndicatorIface =
    <interface name={INTERFACE_NAME}>
        <method name="SetAppletIcon">
            <arg name="status" direction="in" type="s"></arg>
        </method>
    </interface>;

function AeneaIndicatorDBus(applet) {
    this._init(applet);
}

AeneaIndicatorDBus.prototype = {
    _init: function(applet) {
        this._applet = applet;
        this._dbusImpl = Gio.DBusExportedObject.wrapJSObject(
            AeneaIndicatorIface, this
        );
        this._dbusImpl.export(Gio.DBus.session, INTERFACE_PATH);
        this._nameId = Gio.DBus.session.own_name(
            INTERFACE_NAME, Gio.BusNameOwnerFlags.REPLACE, null, null
        );
    },

    destroy: function() {
        this._dbusImpl.unexport();
        Gio.DBus.session.unown_name(this._nameId);
    },

    SetAppletIcon: function(status) {
        this._applet.setIcon(status);
    }
};

function AeneaIndicator(orientation, panel_height, instance_id) {
    this._init(orientation, panel_height, instance_id);
}

AeneaIndicator.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(orientation, panel_height, instance_id) {
        Applet.IconApplet.prototype._init.call(
            this, orientation, panel_height, instance_id
        );
        this.set_applet_icon_name("aenea-light");
        this.set_applet_tooltip(_("click to focus the dragon vm"));
        this._dbus = null;
    },

    onShutdown: function () {
        if (this._dbus !== null) {
            this._dbus.destroy();
        }
    },

    onStartup: function () {
        if (this._dbus === null) {
            this._dbus = new AeneaIndicatorDBus(this);
        }
    },

    on_applet_removed_from_panel: function() {
        this.onShutdown();
    },

    on_applet_added_to_panel: function() {
        this.onStartup();
    },

    on_applet_clicked: function() {
        Util.spawnCommandLine('wmctrl -a " - Oracle VM VirtualBox"');
    },

    setIcon: function (status) {
        if (status === 'idk') {
            this.set_applet_icon_name("aenea-light");
        }
        else if (status === 'green') {
            this.set_applet_icon_name("aenea-green");
        }
        else if (status === 'red') {
            this.set_applet_icon_name("aenea-red");
        }
        else if (status === 'yellow') {
            this.set_applet_icon_name("aenea-yellow");
        }
        else {
            global.log('unknown status=' + status)
        }
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    return new AeneaIndicator(orientation, panel_height, instance_id);
}
