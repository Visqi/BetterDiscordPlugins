/**
 * @name UwUifier
 * @author Visqi
 * @version 1.0.2
 * @authorId 236863914078371842
 * @description Turns all your messages way cuter!
 * @source https://gist.github.com/Visqi/383e96f1c52964a057d3f73edd8b0bd6
 * @updateUrl https://gist.githubusercontent.com/Visqi/383e96f1c52964a057d3f73edd8b0bd6/raw/f50af9a955246240f37f15f9ebb7c809b94c2e58/UwUifier.plugin.js
 */

module.exports = (_ => {
	const config = {
	};

	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		constructor (meta) {for (let key in meta) this[key] = meta[key];}
		getName () {return this.name;}
		getAuthor () {return this.author;}
		getVersion () {return this.version;}
		getDescription () {return `The Library Plugin needed for ${config.info.name} is missing. Open the Plugin Settings to download it. \n\n${config.info.description}`;}
		
		downloadLibrary () {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
				if (!e && b && b.indexOf(`* @name BDFDB`) > -1) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
				else BdApi.alert("Error", "Could not download BDFDB Library Plugin, try again later or download it manually from GitHub: https://github.com/mwittrien/BetterDiscordAddons/tree/master/Library/");
			});
		}
		
		load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${config.info.name} is missing. Please click "Download Now" to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
					onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(config.info.name)) window.BDFDB_Global.pluginQueue.push(config.info.name);
		}
		start () {this.load();}
		stop () {}
		getSettingsPanel () {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${config.info.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
	} : (([Plugin, BDFDB]) => {
		
		var _this;
		var toggleButton;
		var uwuEnabled = false;
		var sounds = [], keybind;
		
		const UwuToggleComponent = class uwuToggle extends BdApi.React.Component {
			componentDidMount() {
				toggleButton = this;
			}
			render() {
				const enabled = uwuEnabled;
				delete this.props.forceState;
				return BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.PanelButton, Object.assign({}, this.props, {
					tooltipText: enabled ? "UwU Disabled" : "UwU Enabled",
					icon: iconProps => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SvgIcon, Object.assign({}, iconProps, {
						nativeClass: true,
						width: 40,
						height: 40,
						style: {paddingTop: "10px"},
						foreground: BDFDB.disCN.accountinfobuttonstrikethrough,
						name: enabled ? BDFDB.LibraryComponents.SvgIcon.Names.FAVORITE_FILLED : BDFDB.LibraryComponents.SvgIcon.Names.FAVORITE
					})),
					onClick: _ => { _this.toggle(); BDFDB.ReactUtils.forceUpdate(this); }
				}));
			}
		};
		
		
		return class UwU extends Plugin {
			
			onLoad () {
				_this = this;
				this.defaults = {
					general: {
						showButton:			{value: true,					description: "Show Quick Toggle Button"},
						showItem:			{value: false,					description: "Show Quick Toggle Item"},
						playEnable:			{value: true,					description: "Play Enable Sound"},
						playDisable:		{value: true,					description: "Play Disable Sound"}
					},
					selections: {
						enableSound:		{value: "stream_started",		description: "Enable Sound"},
						disableSound:		{value: "stream_ended",			description: "Disable Sound"}
					}
				};
				
				this.modulePatches = {
					before: [
					],
					after: [
						//"Account",
						"ChannelTextAreaButtons"
					]
				};
				
				this.css = `
					${BDFDB.dotCNS._gameactivitytoggleadded+ BDFDB.dotCNC.accountinfowithtagasbutton + BDFDB.dotCNS._gameactivitytoggleadded+ BDFDB.dotCN.accountinfowithtagless} {
						flex: 1;
						min-width: 0;
					}
				`;
			}
			
			onStart () {
				this.patchSendMessage();
				
				sounds = [BDFDB.LibraryModules.SoundParser && BDFDB.LibraryModules.SoundParser.keys()].flat(10).filter(n => n).map(s => s.replace("./", "").split(".")[0]).sort();
	
				BDFDB.DiscordUtils.rerenderAll();
			}
			
			onStop () {
				BDFDB.PatchUtils.forceAllUpdates(this);
				BDFDB.MessageUtils.rerenderAll();
			}
			
			toggle () {
				uwuEnabled = !uwuEnabled;
				this.settings.general[uwuEnabled ? "playEnable" : "playDisable"] && BDFDB.LibraryModules.SoundUtils.playSound(this.settings.selections[uwuEnabled ? "enableSound" : "disableSound"], .4);
			}
			
			addButton() { //OLD
				var buttonGroup = document.querySelector(".buttonContainer-2lnNiN");
				
				var newButton = document.createElement("button");
				newButton.textContent = "UWU";
				newButton.style.backgroundColor = "red";
				
				buttonGroup.insertBefore(newButton, buttonGroup.firstChild);
				
				newButton.addEventListener("click", function() {
					var cuco = newButton.style.backgroundColor;
					
					if (cuco === "red") {
						newButton.style.backgroundColor = "green";
						uwuEnabled = true;
					} else {
						newButton.style.backgroundColor = "red";
						uwuEnabled = false;
					}
				});
			}
		
			
			processChannelTextAreaButtons(e) {
	
				if (e.returnvalue) e.returnvalue.props.children.unshift(BDFDB.ReactUtils.createElement(UwuToggleComponent, {
					guildId: e.instance.props.channel.guild_id ? e.instance.props.channel.guild_id : "@me",
					channelId: e.instance.props.channel.id
				}));
				
			}
			
			processAccount(e) {
				let [children, index] = BDFDB.ReactUtils.findParent(e.returnvalue, {name: "PanelButton"});
				if (index > -1) {
					e.returnvalue.props.className = BDFDB.DOMUtils.formatClassName(e.returnvalue.props.className, BDFDB.disCN._gameactivitytoggleadded);
					children.unshift(BDFDB.ReactUtils.createElement(UwuToggleComponent, {}));
				}
			}


			uwufy(text) {
				
				if (!uwuEnabled)
					return text;
				
				const smiles = ['^_^', '(・`ω´・)', '>:3', 'UwU', '>_<', ':3', 'x3', '^._.^', '(* ^ ω ^)', '(o_ _)ﾉ彡☆', 'ヾ(=`ω´=)ノ”', '(〒︿〒)', '(｡•́︿•̀｡)', '(/ω＼)', '(／。＼)', ':"D', '(≧▽≦)', '(＾▽＾)', '(⌒_⌒;)', '(*4*)', '(≧∀≦)', '(≧∇≦*)', '(;*△*;)', '(>_<)', '(♥ω♥*)', '＼(☆o☆)／', '＼(★∀★)／', '＼(^ω^＼)', '٩(◕‿◕｡)۶', '(o^▽^o)', '(✯◡✯)', '(っ◔◡◔)っ', '(*^ -^*)', '(^_^)', '(〃ω〃)', '(｡♥‿♥｡)', 'ヽ(*⌒▽⌒*)ﾉ', '٩(｡•́‿•̀｡)۶', 'o((*^▽^*))o', 'o(≧∀≦)o', '(─‿‿─)', '(*^‿^*)', 'ヽ(o＾▽＾o)ノ', '＼(^ω^＼)', '(*^.^*)', '(✿◠‿◠)', '(• ε •)', '(^O^)', '(^▽^)', '(⌒▽⌒)☆', '(￣ω￣)', '(◕‿◕)', '(◕‿◕✿)', '(*◕‿◕*)', '^_^', '(*^_^*)', '(¬‿¬)', '(＾◡＾)', '｡◕‿‿◕｡'];

				// Uwufy the text
				let uwufiedText = text
					.replace(/r|l/g, 'w')
					.replace(/R|L/g, 'W')
					.replace(/n([aeiou])/g, 'ny$1')
					.replace(/N([aeiou])/g, 'Ny$1')
					.replace(/N([AEIOU])/g, 'Ny$1')
					.replace(/ove/g, 'uv')
					.replace(/th/g, 'd')
					.replace(/Th/g, 'D')
					.replace(/!+/g, '!!')
					.replace(/\. /g, '~. ')
					.replace(/you/g, 'u')
					.replace(/please/g, 'pwease')
					.replace(/excuse me/g, 'um..')
					.replace(/mate/g, 'mawte')
					.replace(/my/g, 'mwy')
					.replace(/s+/g, 's~')
					.replace(/ing/g, 'ing~')
					.replace(/!/g, ' !~')
					.replace(/hello/g, 'hewwo')
					.replace(/hi/g, 'hai')
					.replace(/how are you/g, 'howws u')
					.replace(/good/g, 'gud')
					.replace(/ok/g, 'oki') .replace(/is/g, 'ish')
					.replace(/are/g, 'awe')
					.replace(/want/g, 'wanna')
					.replace(/love/g, 'wuv')
					.replace(/be/g, 'bwe')
					.replace(/thanks/g, 'fankies')
					.replace(/sorry/g, 'sowwy')
					.replace(/beautiful/g, 'bootiful')
					.replace(/nice/g, 'nyce')
					.replace(/great/g, 'gwate')
					.replace(/amazing/g, 'amazin')
					.replace(/awesome/g, 'awesum')
					.replace(/wonderful/g, 'wundewful')
					.replace(/fantastic/g, 'fantastical')
					.replace(/delicious/g, 'delish')
					.replace(/happy/g, 'happii')
					.replace(/fun/g, 'funnie')
					.replace(/exciting/g, 'excitin')
					.replace(/cute/g, 'kawaii')
					.replace(/pretty/g, 'pwetty')
					.replace(/adorable/g, 'adoraboo')
					.replace(/magical/g, 'magikaru')
					.replace(/thank you/g, 'thankies')
					.replace(/hug/g, 'huggie')
					.replace(/kiss/g, 'kissu');

				let sentences = uwufiedText.split('. ');
				uwufiedText = sentences.map(sentence => {
					if (sentence !== '') {
						let smile = smiles[Math.floor(Math.random() * smiles.length)];
						return sentence + ' ' + smile;
					} else {
						return sentence;
					}
				}).join('. ');

				return uwufiedText;
			}

			patchSendMessage (e) {
				 BDFDB.PatchUtils.patch(this, BDFDB.LibraryModules.MessageUtils, "sendMessage", {instead: e => {
					e.methodArguments[1].content = this.uwufy(e.methodArguments[1].content);
		
				e.callOriginalMethodAfterwards();
			}});
		}
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();
