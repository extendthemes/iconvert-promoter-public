const { resolve } = require( 'path' );
const { spawn } = require( 'child_process' );
const { wpCLIResponse } = require( './wp-cli-exec' );
const dotenv = require( 'dotenv' );

dotenv.config( { path: resolve( __dirname, '../.env' ) } );

const editor = process.env.TEXT_EDITOR || 'code';

const confPath = wpCLIResponse( 'config', 'path' );

spawn( editor, [ confPath ] );
