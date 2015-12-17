from yapsy.IPlugin import IPlugin
from subprocess import Popen
from subprocess import PIPE


enabled = True


class IndicatorPlugin(IPlugin):
    STATE_COLOR_MAP = {
        'off': 'red',
        'on': 'green',
        'sleeping': 'yellow',
        'idk': 'idk'
    }

    def register_rpcs(self, server):
        server.register_function(self.natlink_microphone_change)

    @staticmethod
    def natlink_microphone_change(args):
        color = IndicatorPlugin.STATE_COLOR_MAP.get(args, 'idk')
        try:
            Popen([
                '/usr/bin/dbus-send',
                '--type=method_call',
                '--print-reply',
                '--dest=com.mhzizzi.AeneaIndicator.Interface',
                '/com/mhzizzi/AeneaIndicator/Interface',
                'com.mhzizzi.AeneaIndicator.Interface.SetAppletIcon',
                'string:%s' % color
            ], stdout=PIPE, stderr=PIPE)
        except Exception as e:
            print 'natlink_microphone_change error: ', e
