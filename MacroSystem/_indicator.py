import natlink
import natlinkmain
from aenea.communications import server


original_changeCallback = natlinkmain.changeCallback


def patched_changeCallback(command, args):
    print 'patched_changeCallback', command, args

    if command == 'mic':
        try:
            server.natlink_microphone_change(args)
        except Exception as e:
            print 'failed to notify server of microphone state change: ', e

    original_changeCallback(command, args)


natlinkmain.changeCallback = patched_changeCallback


def unload():
    natlink.setChangeCallback(original_changeCallback)
