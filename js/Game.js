class Game {
    constructor(){
        this.board = new Board();
        this.players = this.createPlayers();
        this.ready = false;
    }
    /**
     * Creates two player objects
     * @return {array}    An array of two player objects.
     */
    createPlayers(){
        const players = [new Player ('Player 1', 1, '#e15258', true),
                         new Player ('Player 2', 2, '#e59a13')];
        return players;
    }

    get activePlayer(){
        return this.players.find(player => player.active) //I used find() to return one(the first) element that passes the test
    }
    /**
     * Gets Game ready to play
     */
    startGame(){
        this.board.drawHTMLBoard();
        this.activePlayer.activeToken.drawHTMLToken();
        this.ready = true;

    };
    /**
     * Branches code, depending on what key player presses
     * @param   {Object}    event - Keydown event object
     */ 
    handleKeydown(event){
        if (this.ready === true){
            if (event.key === 'ArrowLeft') {
                this.activePlayer.activeToken.moveLeft();
            } else if (event.key === 'ArrowRight'){
                this.activePlayer.activeToken.moveRight(this.board.columns);
            } else if (event.key === 'ArrowDown' ){
                this.playToken();
            }
        }
    }

   /*  playToken() {

        let target = null;
        for (let space of this.board.spaces[this.activePlayer.activeToken.columnLocation]){
            if (space.token === null){
                target = space;
            }
        }
        if (target !== null){
            Game.ready = false;
            this.activePlayer.activeToken.drop(target)
        }
    } */
    playToken(){
        let spaces = this.board.spaces;
        let activeToken = this.activePlayer.activeToken;
        let targetColumn = spaces[activeToken.columnLocation];
        let targetSpace = null;
    
        for (let space of targetColumn) {
            if (space.token === null) {
                targetSpace = space;
            }
        }
    
        if (targetSpace !== null) {
            const game = this;
            game.ready = false;
    
            activeToken.drop(targetSpace, function(){
                game.updateGameState(activeToken, targetSpace);           
            });  
        }              
    }
     
    checkForWin(target){

        const owner = target.token.owner;
        let win = false;
        //Check Vertical
        for (let x = 0; x < this.board.columns; x++) {
            for (let y = 0; y < this.board.rows - 3; y++){
                if (this.board.spaces[x][y].owner === owner &&
                    this.board.spaces[x][y + 1].owner === owner &&
                    this.board.spaces[x][y + 2].owner === owner &&
                    this.board.spaces[x][y + 3].owner === owner){
                        win = true;
                    }
            }
        }
        // Check Horizontal
        for(let x = 0; x < this.board.columns - 3; x++){
            for (let y = 0; y < this.board.rows; y++){
                if ( this.board.spaces[x][y].owner === owner &&
                    this.board.spaces[x + 1][y].owner === owner &&
                    this.board.spaces[x + 2][y].owner === owner &&
                    this.board.spaces[x + 3][y].owner === owner ){
                        win = true;
                    }
            }
        }
        //Check diagonal
        for (let x = 3; x < this.board.columns; x++ ){
            for (let y = 0; y < this.board.rows - 3; y++){
                if (this.board.spaces[x][y].owner === owner && 
                    this.board.spaces[x-1][y+1].owner === owner && 
                    this.board.spaces[x-2][y+2].owner === owner && 
                    this.board.spaces[x-3][y+3].owner === owner) {
                        win = true;
                }           
            }
        }
    
        // diagonal
        for (let x = 3; x < this.board.columns; x++ ){
            for (let y = 3; y < this.board.rows; y++){
                if (this.board.spaces[x][y].owner === owner && 
                    this.board.spaces[x-1][y-1].owner === owner && 
                    this.board.spaces[x-2][y-2].owner === owner && 
                    this.board.spaces[x-3][y-3].owner === owner) {
                        win = true;
                }           
            }
        }
        return win;
    }

    switchPlayers(){
        for(let player of this.players) {
            player.active = player.active === true ? false : true;
        }
    }

    gameOver(message) {
        document.querySelector('#game-over').style.diplay = 'block';
        document.querySelector('#game-over').textContent = message;
    }
    /** 
 * Updates game state after token is dropped. 
 * @param   {Object}  token  -  The token that's being dropped.
 * @param   {Object}  target -  Targeted space for dropped token.
 */
    updateGameState(token, target){
        target.mark(token);

        if (!this.checkForWin(target)) {

            this.switchPlayers();

            if(this.activePlayer.checkTokens()){
                this.activePlayer.activeToken.drawHTMLToken();
                this.ready = true;
            } else {
                this.gameOver('No more tokens');
            }
        }
        else{
            this.gameOver(`${target.owner.name} wins!`)

            
            }
        
        }
    
}